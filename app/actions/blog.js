'use server';

import { ObjectId } from 'mongodb';
import mongoClient from '@/app/util/db';

const db = (await mongoClient()).db('blog');

export async function getAllPosts() {
  try {
    return await db.collection('posts').find().sort({ title: 1 }).toArray();
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

export async function createPost(formData) {
  try {
    await db.collection('posts').insertOne({ title: formData.get('postTitle'), content: formData.get('postContent') });
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    console.error('Error in createPost:', error);
    throw new Error('Failed to create post');
  }
}

export async function deletePostByTitle(formData) {
  try {
    await db.collection('posts').deleteOne({ title: formData.get('postTitle') });
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    console.error('Error in deletePost:', error);
    throw new Error('Failed to delete post');
  }
}
