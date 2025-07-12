"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Quote, RefreshCw, Copy, Check, Heart } from "lucide-react"

interface QuoteData {
  text: string
  author: string
  source?: string
  original?: {
    text: string
    author: string
  }
}

const languages = {
  en: "English",
  fr: "Français",
  it: "Italiano",
  es: "Español",
  ar: "العربية",
}

export default function QuoteGenerator() {
  const [currentQuote, setCurrentQuote] = useState<QuoteData | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showQuote, setShowQuote] = useState(false) // State for fade effect

  // Auto-detect user language preference
  useEffect(() => {
    const detectLanguage = () => {
      const browserLang = navigator.language.split("-")[0]
      if (Object.keys(languages).includes(browserLang)) {
        setSelectedLanguage(browserLang)
      }
    }
    detectLanguage()
  }, [])

  // Fetch initial quote
  useEffect(() => {
    fetchNewQuote()
  }, [selectedLanguage])

  const fetchNewQuote = async () => {
    setLoading(true)
    setShowQuote(false) // Start fade out

    // Give time for fade out animation before fetching new quote
    setTimeout(async () => {
      try {
        const response = await fetch(`/api/quote?lang=${selectedLanguage}`)
        const data = await response.json()
        setCurrentQuote(data)
      } catch (error) {
        console.error("Error fetching quote:", error)
        // Set a fallback quote
        setCurrentQuote({
          text: "The only true wisdom is in knowing you know nothing.",
          author: "Socrates",
          source: "fallback",
        })
      } finally {
        setLoading(false)
        setShowQuote(true) // Start fade in
      }
    }, 300) // Adjust delay to match fade-out transition duration
  }

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang)
  }

  const copyQuote = async () => {
    if (currentQuote) {
      await navigator.clipboard.writeText(`"${currentQuote.text}" - ${currentQuote.author}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dusk-offwhite via-dusk-verylightbluegray to-dusk-lightbluegray relative overflow-hidden text-foreground">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-dusk-maroon to-dusk-burntorange rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-dusk-lightbluegray to-dusk-verylightbluegray rounded-full blur-lg"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-dusk-maroon to-dusk-burntorange rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-dusk-lightbluegray to-dusk-burntorange rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Quote className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-serif text-foreground tracking-wide">Verba Sapientiae</h1>
          </div>
          <p className="text-muted-foreground text-lg font-light font-poppins">words of wisdom</p>
          <p className="text-gray-600 text-lg font-light font-poppins">
            Discover inspiration across cultures and languages
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {Object.entries(languages).map(([code, name]) => (
            <Button
              key={code}
              variant={selectedLanguage === code ? "default" : "outline"}
              onClick={() => handleLanguageChange(code)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedLanguage === code
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg"
                  : "bg-card/70 backdrop-blur-sm hover:bg-card/90 text-foreground border-border"
              }`}
            >
              {name}
            </Button>
          ))}
        </div>

        {/* Quote Display */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              {loading && !currentQuote ? ( // Only show loading spinner if no quote is present yet
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
                  <p className="text-muted-foreground">Fetching wisdom...</p>
                </div>
              ) : currentQuote ? (
                <div
                  className={`text-center transition-opacity duration-300 ${
                    showQuote ? "opacity-100" : "opacity-0"
                  } ${selectedLanguage === "ar" ? "text-right" : "text-left"}`}
                >
                  <blockquote
                    className={`text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed text-foreground mb-6 ${
                      selectedLanguage === "ar" ? "font-arabic" : ""
                    }`}
                  >
                    "{currentQuote.text}"
                  </blockquote>
                  <cite className="text-lg md:text-xl text-muted-foreground font-light not-italic">
                    — {currentQuote.author}
                  </cite>

                  {/* Show original quote if translated */}
                  {currentQuote.original && selectedLanguage !== "en" && (
                    <details className="mt-6 text-left">
                      <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                        View original English
                      </summary>
                      <div className="mt-2 p-4 bg-muted rounded-lg text-sm">
                        <p className="italic">"{currentQuote.original.text}"</p>
                        <p className="text-muted-foreground mt-1">— {currentQuote.original.author}</p>
                      </div>
                    </details>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Click "New Quote" to begin your journey of wisdom
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={fetchNewQuote}
            disabled={loading}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${loading ? "animate-spin" : ""}`} />
            New Quote
          </Button>

          {currentQuote && (
            <Button
              onClick={copyQuote}
              variant="outline"
              className="bg-card/70 backdrop-blur-sm hover:bg-card/90 text-foreground border-border px-6 py-3 rounded-full transition-all duration-300"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-2" />
                  Copy Quote
                </>
              )}
            </Button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-muted-foreground text-sm">
          <p className="font-poppins">Wisdom transcends borders • Inspiration knows no language</p>
          <p className="mt-2 flex items-center justify-center font-poppins">
            Created by Serine with <Heart className="w-4 h-4 mx-1 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </div>
  )
}
