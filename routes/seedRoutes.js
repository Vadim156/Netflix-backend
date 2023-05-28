import express from 'express'
import List from '../models/listSchema.js'
import Content from '../models/contentScheme.js'
import User from '../models/userSchema.js'
import expressAsyncHandler from 'express-async-handler'

import { listMovieNames, listSeriesNames, genres, data } from '../data.js'

const seedRouter = express.Router()

seedRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      await User.deleteMany({})
      const createdUsers = await User.insertMany(data.users)

      await Content.deleteMany({})
      const createdContent = await Content.insertMany(data.content)

      await List.deleteMany({})

      
      
      

      await seedLists(listSeriesNames, 'series')
      await seedLists(listMovieNames, 'movies')

      const createdLists = await List.insertMany(data.lists)

      res.send({
        createdUsers,createdContent,createdLists
      })

    } catch (err) {
      console.log('Faild to update users | content | lists ')
    }
  })
)

const seedLists = async (array, type) => {
  for (let i = 0; i < array.length; i++) {
    const isSeries = type === 'movies' ? false : true
    const newList = await Content.aggregate([
      { $match: { isSeries: isSeries } },
      { $sample: { size: 8 } }
    ])
    newList.map(i => i._id)
    const newListcontent = new List({
      title: array[i],
      type: type,
      genre: genres[i],
      contents: newList
    })
    console.log(newListcontent), console.log(newListcontent.contents)
    await newListcontent.save()
  }
}

export default seedRouter
