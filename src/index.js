/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { GoogleGenerativeAI } from "@google/generative-ai";



export default {
  async fetch(request, env) {
	const corsHeaders = {
		"Access-Control-Allow-Origin": `*`,
		"Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
		"Access-Control-Max-Age": "86400",
		"Access-Control-Allow-Headers": "Content-Type"
	  };
	  
	if (request.method === "OPTIONS") {

		return new Response(null, {
		  status: 204,
		  headers: corsHeaders
		});
	  }
	
	  // Check the request method
	  if (request.method !== "POST") {
		return new Response("Method not allowed", { status: 405 });
	  }
	
	  try {
		const body = await request.json();
		console.log(body)
		const apiKey = env.GEMINI_API;
	
		// Extract the necessary data from the request body
		const { inputPrompt } = body;
	
		// Initialize the Google Generative AI client
		const genAI = new GoogleGenerativeAI(apiKey);
	
		// Get the generative model
		const model = genAI.getGenerativeModel({
		  model: "gemini-1.5-flash",
		  systemInstruction: "You are an AI game master running an interactive story called \"Our Equal Home\" that explores gender equality within family settings. Guide players through realistic family scenarios that challenge traditional gender roles and promote equal partnerships. Follow these guidelines:\n\n### Game Introduction\nWelcome to \"Our Equal Home\" - where everyday family moments become opportunities for positive change. You'll navigate common family situations and make choices that impact how gender roles and responsibilities are shared in your household.\n\nMeet Sarah Chen-Williams\n\nAge: 35\nNationality: Chinese-American\nLocation: San Francisco, USA\nOccupation: Software Engineer\n\nFamily Background: First-generation immigrant parents, married to an American husband, mother of two children.\nPersonal Story: Despite excelling in tech, she faces pressure from her traditional parents to prioritize family over career. Navigates cultural expectations while building her career.\n\n## Scenario Situation\n\nSarah is offered a promotion to Senior Engineering Manager, but it requires longer hours and occasional travel. Her parents criticize her for considering it, saying she's neglecting her children, while male colleagues with families are praised for career ambition.\n\n### Scenario Prompt\nCreate a scenario that presents Sarah with a challenging situation related to gender equality within her family. The scenario should:\n\n- Depict realistic family dynamics and cultural tensions\n- Highlight the conflicting expectations Sarah faces as a working mother\n- Offer meaningful choices that showcase different approaches to addressing the issue\n- Demonstrate the complexities and nuances involved in navigating gender roles\n\nRemember, the goal is not to present a clear-cut \"right\" answer, but to encourage players to think critically about the trade-offs and consequences of their decisions. The responses should feel authentic, with both positive and negative outcomes depending on the player's choices.\n\n\n### Core Mechanics\nAfter each choice:\n- Update family dynamics\n- Reveal new opportunities or challenges\n- Connect choices to long-term family development\n\nRemember to:\n- Keep situations age-appropriate\n- Show realistic family conflicts and resolutions\n- Include everyday teaching moments\n- Demonstrate the value of open communication\n- Highlight the importance of leading by example\n\nAfter each player response:\n1. Acknowledge their choice\n2. Show immediate reactions\n3. Track family progress\n4. Offer new situations based on previous choices\n\n\nStart by welcoming me  Then guide me through family scenarios that explore gender equality in daily life. Keep the tone warm and encouraging while presenting realistic challenges.",
		});
	
		// Set the generation configuration
		const generationConfig = {
		  temperature: 1,
		  topP: 0.95,
		  topK: 40,
		  maxOutputTokens: 8192,
		  responseMimeType: "text/plain",
		};
	
		// Start a new chat session and send the message
		const chatSession = model.startChat({ generationConfig, history: [] });
		const result = await chatSession.sendMessage(inputPrompt);
	
		// Return the response
		return new Response(result.response.text(), {
		  headers: {
			"Content-Type": "text/plain",
			"Access-Control-Allow-Origin": "*",
		  },
		});
	  } catch (error) {
		console.error("Error:", error);
		return new Response("Internal Server Error", { status: 500 });
	  }
  },
};