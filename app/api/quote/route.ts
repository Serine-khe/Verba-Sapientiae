import { type NextRequest, NextResponse } from "next/server"
import { getRandomQuote } from "@/lib/quotes" // Corrected import to getRandomQuote

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang") ?? "en"

  try {
    const quote = await getRandomQuote(lang)

    return NextResponse.json({
      text: quote.text,
      author: quote.author,
      source: "local",
    })
  } catch (error) {
    console.error("Quote API error:", error)
    return NextResponse.json(
      { text: "An unexpected error occurred.", author: "System", source: "error" },
      { status: 500 },
    )
  }
}
