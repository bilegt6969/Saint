import type { CollectionConfig } from 'payload';

export const ProductPosts: CollectionConfig = {
  slug: 'product-posts',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  labels: {
    singular: 'Product Post',
    plural: 'Product Posts',
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: false,
      unique: true,
    },
    {
      name: 'imageUrls',
      type: 'array',  // Store multiple image URLs
      fields: [
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
  ],
};
