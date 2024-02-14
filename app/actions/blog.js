'use server';

import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';
import mongoClient from '@/src/util/db';

const db = (await mongoClient()).db('blog');

export const getAllPosts = cache(async () => {
  try {
    return await db.collection('posts').find().sort({ title: 1 }).toArray();
  } catch (error) {
    throw new Error(`Failed to retrieve all posts, error: ${error}`);
  }
});

export const getPost = cache(async (id) => {
  try {
    return await db.collection('posts').findOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw new Error(`Failed to retrieve individual post, error: ${error}`);
  }
});

export async function createPost(formData) {
  try {
    await db.collection('posts').insertOne({ title: formData.get('postTitle'), content: formData.get('postContent') });
    revalidatePath('/');
  } catch (error) {
    throw new Error(`Failed to create post, error: ${error}`);
  }
}

export async function deletePostByTitle(formData) {
  try {
    await db.collection('posts').deleteOne({ title: formData.get('postTitle') });
    revalidatePath('/');
  } catch (error) {
    throw new Error(`Failed to delete post, error: ${error}`);
  }
}
