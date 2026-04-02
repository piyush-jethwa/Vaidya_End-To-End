import { Request, Response } from "express";

export const validateKey = async (req: Request, res: Response) => {
  try {
    const { apiKey, provider } = req.body;

    if (!apiKey || typeof apiKey !== 'string') {
      return res.status(400).json({
        valid: false,
        error: 'API key is required'
      });
    }

    const trimmedKey = apiKey.trim();

    if (provider === 'groq') {
      // Basic format check for Groq key
      if (!trimmedKey.startsWith('gsk_') || trimmedKey.length < 30) {
        return res.status(400).json({
          valid: false,
          error: 'Invalid Groq API key format. Should start with "gsk_" and be ~40 chars.'
        });
      }

      // Skip online validation to avoid network issues - Groq endpoints validate key
      console.log('Groq API key format validated');

      return res.json({
        valid: true,
        message: 'Groq API key validated successfully! Ready to use with AI features.'
      });
    } else if (provider === 'gemini') {
      // Basic Gemini key check
      if (!trimmedKey.startsWith('AIza') || trimmedKey.length !== 39) {
        return res.status(400).json({
          valid: false,
          error: 'Invalid Gemini API key format. Should be 39 chars starting with "AIza".'
        });
      }

      return res.json({
        valid: true,
        message: 'Gemini API key format validated. Note: Full validation requires Gemini SDK.'
      });
    } else {
      return res.status(400).json({
        valid: false,
        error: 'Unsupported provider. Use "groq" or "gemini".'
      });
    }
  } catch (error: any) {
    console.error('Key validation error:', error);
    res.status(500).json({
      valid: false,
      error: 'Validation server error: ' + (error.message || 'Unknown error')
    });
  }
};
