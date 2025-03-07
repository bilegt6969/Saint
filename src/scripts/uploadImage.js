const FormData = require('form-data');
const axios = require('axios');

const PAYLOAD_API_URL = 'http://localhost:3000/api/media';  // Update if needed
const PAYLOAD_API_KEY = process.env.PAYLOAD_SECRET;  // Replace with actual API key

const uploadImageToPayload = async (imageUrl, fileName) => {
    try {
        const res = await axios.get(imageUrl, { responseType: 'stream' });
        
        const formData = new FormData();
        formData.append('file', res.data, fileName);

        const uploadRes = await axios.post(
            PAYLOAD_API_URL,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${PAYLOAD_API_KEY}`,
                    ...formData.getHeaders()
                }
            }
        );

        return uploadRes.data.id; // Returns the uploaded image ID
    } catch (error) {
        console.error('Upload failed:', error);
        return null;
    }
};

module.exports = { uploadImageToPayload };
