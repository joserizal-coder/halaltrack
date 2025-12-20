
import { GoogleGenAI } from "@google/genai";

export const analyzeTask = async (taskName: string, description: string, stage: string) => {
  // Fix: Use import.meta.env for consistency in Vite environment
  const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY is missing. AI features will be disabled.");
    return "Maaf, fitur AI tidak dapat diaktifkan karena API Key belum dikonfigurasi.";
  }

  const ai = new GoogleGenAI(apiKey);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Analisis tugas sertifikasi Halal berikut:
        Nama: ${taskName}
        Deskripsi: ${description}
        Tahap Saat Ini: ${stage}

        Berikan ringkasan singkat mengenai potensi risiko, dokumen yang diperlukan untuk tahap ini, dan saran untuk mempercepat proses.
      `,
      config: {
        systemInstruction: "Anda adalah konsultan sertifikasi Halal profesional. Berikan respon yang sangat ringkas, terstruktur (bullet points), dan profesional dalam Bahasa Indonesia.",
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    // Fix: Provide a generic error message without exposing environment variable details
    return "Maaf, analisis AI saat ini tidak tersedia.";
  }
};
