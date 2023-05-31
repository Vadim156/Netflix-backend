import express from 'express'
import List from '../models/listSchema.js'
import Content from '../models/contentSchema.js'
import User from '../models/userSchema.js'
import expressAsyncHandler from 'express-async-handler'

import { listMovieNames, listSeriesNames, genres, data } from '../data.js'
import { isAuth } from '../utils.js'

const listsRouter = express.Router()

listsRouter.get('/', isAuth, async (req, res) => {
  const typeQuery = req.query.type
  const genreQuery = req.query.genre

  let list = []

  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery, genre: genreQuery } }
        ])
        list = await List.populate(list, { path: 'contents' })
      } else {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery } }
        ])

        list = await List.populate(list, { path: 'contents' })
      }
    } else {
      list = await List.find().populate('contents') // Retrives whole object
    }
    res.status(200).json(list)
  } catch (err) {
    res.status(500).json(err)
  }
})

export default listsRouter
