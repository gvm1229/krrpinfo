import { ObjectId } from 'mongodb';
import mongoClient from '@/app/util/db';

const db = (await mongoClient()).db('blog');

export async function getAllPosts() {
  try {
    return await db.collection('posts').find().toArray();
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    console.error('Error in getAllPosts:', error);
    throw new Error('Failed to retrieve posts');
  }
}

export async function getPost(id) {
  try {
    return await db.collection('posts').findOne({ _id: new ObjectId(id) });
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    console.error('Error in getPost:', error);
    throw new Error('Failed to retrieve individual post');
  }
}
