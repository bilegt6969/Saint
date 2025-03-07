// src/collections/Upload.ts

import type { CollectionConfig } from 'payload'

const Upload: CollectionConfig = {
  slug: 'upload',
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
    staticDir: 'uploads', // Where images will be stored
    mimeTypes: ['image/*'], // Allow all image types
  },
  fields: [],
};

export default Upload;
