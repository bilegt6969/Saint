import sharp from 'sharp';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { buildConfig } from 'payload';
import { Media } from './src/collections/Media';
import { ProductPosts } from './src/collections/Product_Posts';
import { Hero } from './src/collections/Hero';

export default buildConfig({
  // Set up the editor for rich text fields
  editor: lexicalEditor(),

  // Define collections
  collections: [
    ProductPosts,
    Media,  // Import Media collection here
    Hero,
  ],

  // Payload secret for security
  secret: process.env.PAYLOAD_SECRET as string,

  // Database configuration using mongoose adapter
  db: mongooseAdapter({
    url: process.env.DATABASE_URI as string,
  }),

  // Image resizing configuration using sharp
  sharp,
});
