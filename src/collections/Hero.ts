// src/collections/Hero.ts
import type { CollectionConfig } from 'payload'

export const Hero: CollectionConfig = {
  slug: 'Hero',
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
  labels: {
    singular: 'Hero',
    plural: 'Hero(S)',
  },
  fields: [
    {
      name: 'Heading',
      type: 'text',
      required: false,
    },
    {
      name: 'Description',
      type: 'text',
      required: false,
    },
    {
      name: 'Hero Image',
      type: 'upload',
      required: false,
      relationTo: 'media', // Ensures this upload field relates to the 'media' collection
    },
    {
      name: 'Link',
      type: 'text',
      required: false, // Could also make this a URL type if you're expecting a URL
    }
  ],
};
