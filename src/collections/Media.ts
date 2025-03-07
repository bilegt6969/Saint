// src/collections/Media.ts
import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => {
      return true; // Allow everyone to read
    },
    create: () => {
      return true; // Allow everyone to create
    },
    update: () => {
      return true; // Allow everyone to update
    },
    delete: () => {
      return true; // Allow everyone to delete
    },
  },
  upload: {
    staticDir: 'media', // Directory where images are stored
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined, // Retains aspect ratio
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'], // Restrict uploads to images
  },
  fields: [
    {
      name: 'slug',
      type: 'text', // Alt text for accessibility
    },
    {
      name: 'image',
      type: 'upload', // Define the upload field
      relationTo: 'media', // Specify the relationship
    },
  ],
};
