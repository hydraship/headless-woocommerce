import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || '';
  const { urlPath } = req.query;
  if (!urlPath || typeof urlPath !== 'string') {
    return res.status(400).json({ error: 'urlPath is required and must be a string' });
  }

  // Ensure the base URL doesn't have a trailing slash
  const baseUrl = wordpressUrl.replace(/\/$/, '');
  // Ensure urlPath doesn't have a leading slash
  const cleanUrlPath = urlPath.replace(/^\//, '');

  // Construct the final URL
  const targetUrl = `${baseUrl}/${cleanUrlPath}?no-redirect=1`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Referer: wordpressUrl,
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
      },
    });

    const html = await response.text();

    // ✅ Send the response correctly
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Content-Security-Policy', 'frame-ancestors *');
    res.status(200).send(html);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Proxy Error:', error);
    res.status(500).send('Error fetching page');
  }
}
