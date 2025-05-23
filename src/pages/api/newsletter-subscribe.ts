// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

import { env } from '@src/lib/env';
import { AUTHORIZATION_HEADER } from '@src/lib/wc-api';

interface ResponseData {
  status: string;
  message: string;
}

interface WordPressResponseData {
  status?: string;
  message?: string;
  [key: string]: unknown;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      status: 'error',
      message: 'Method Not Allowed',
    });
  }

  const { email } = req.body;
  const { NEXT_PUBLIC_WORDPRESS_SITE_URL } = env();

  if (!email) {
    return res.status(400).json({
      status: 'error',
      message: 'Email is required',
    });
  }

  // Create form data instead of JSON
  const formData = new URLSearchParams();
  formData.append('email', email);

  const config: AxiosRequestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/sggc-api/v1/wc/sgm-subscribe`,
    headers: {
      ...AUTHORIZATION_HEADER,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: formData,
  };

  try {
    // For debugging in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log('Sending request to WordPress with data:', formData.toString());
    }

    const response = await axios.request(config);

    // For debugging in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log('WordPress response:', response.data);
    }

    // Check if the response contains a message about empty email
    if (
      response.data &&
      typeof response.data === 'string' &&
      response.data.includes('This email is empty')
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Email address is required.',
      });
    }

    // Handle success response
    // Check if the response is a string (HTML) or an object (JSON)
    if (typeof response.data === 'string') {
      // If it's a string, check if it contains success message
      if (response.data.toLowerCase().includes('success')) {
        return res.status(200).json({
          status: 'success',
          message: 'Your subscription has been successful.',
        });
      } else {
        // If it doesn't contain success, it might be an error
        return res.status(400).json({
          status: 'error',
          message: 'There was an issue with your subscription. Please try again.',
        });
      }
    } else {
      // If it's an object, parse it as usual
      const responseData = response.data as WordPressResponseData;
      return res.status(200).json({
        status: responseData.status || 'success',
        message: responseData.message || 'Your subscription has been successful.',
      });
    }
  } catch (error) {
    // More detailed error handling
    let errorMessage = 'Something went wrong. Please try again later.';

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const responseData = axiosError.response.data as WordPressResponseData;
        errorMessage = responseData?.message || errorMessage;
      } else if (axiosError.request) {
        // The request was made but no response was received
        errorMessage = 'No response received from server. Please try again later.';
      }
    }

    return res.status(500).json({
      status: 'error',
      message: errorMessage,
    });
  }
}
