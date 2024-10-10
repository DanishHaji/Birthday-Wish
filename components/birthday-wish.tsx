'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { FaBirthdayCake, FaGift } from 'react-icons/fa'
import { GiBalloons } from 'react-icons/gi'


type ConfettiProps = {
  width: number
  height: number
}


const DynamicConfetti = dynamic(() => import('react-confetti'), { ssr: false })


const candleColors = ['#FF5733', '#FFBD33', '#DBFF33', '#75FF33', '#33FF57']
const balloonColors = ['#FF5733', '#33C1FF', '#8C33FF', '#FF33B4', '#FF33C1']
const confettiColors = ['#FF5733', '#FFD700', '#32CD32', '#1E90FF', '#FF69B4', '#FF4500', '#DA70D6']

export default function BirthdayWish() {
  const [candlesLit, setCandlesLit] = useState<number>(0) // Number of lit candles
  const [balloonsPoppedCount, setBalloonsPoppedCount] = useState<number>(0) // Number of popped balloons
  const [showConfetti, setShowConfetti] = useState<boolean>(false) // Whether to show confetti
  const [windowSize, setWindowSize] = useState<ConfettiProps>({ width: 0, height: 0 }) // Window size for confetti
  const [celebrating, setCelebrating] = useState<boolean>(false) // Whether celebration has started

  
  const totalCandles: number = 5 
  const totalBalloons: number = 5 


  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (candlesLit === totalCandles && balloonsPoppedCount === totalBalloons) {
      setShowConfetti(true)
    }
  }, [candlesLit, balloonsPoppedCount])

  const lightCandle = (index: number) => {
    if (index === candlesLit) {
      setCandlesLit(prev => prev + 1)
    }
  }

  const popBalloon = (index: number) => {
    if (index === balloonsPoppedCount) {
      setBalloonsPoppedCount(prev => prev + 1)
    }
  }

  const celebrate = () => {
    setCelebrating(true)
    setShowConfetti(true)
    const interval = setInterval(() => {
      setCandlesLit(prev => {
        if (prev < totalCandles) return prev + 1
        clearInterval(interval)
        return prev
      })
    }, 500)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Animated wrapper for the card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Birthday card */}
        <Card className="relative mx-auto overflow-hidden transition-transform duration-400 ease-in-out hover:scale-105 hover:shadow-2xl rounded-lg border-4 border-black-800 shadow-lg bg-grey">
          {/* Card header with birthday message */}
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-black">Happy 28th Birthday!</CardTitle>
            <CardDescription className="text-2xl font-semibold text-gray-600">DANISH</CardDescription>
            <p className="text-lg text-gray-500">February 16th</p>
          </CardHeader>
          {/* Card content with candles and balloons */}
          <CardContent className="space-y-6 text-center">
            {/* Candles section */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-2">Light the Candles:</h3>
              <div className="flex justify-center space-x-2">
                {/* Map through candles */}
                {[...Array(totalCandles)].map((_, index) => (
                  <AnimatePresence key={index}>
                    {/* Render lit or unlit candle based on state */}
                    {(celebrating && index <= candlesLit) || (!celebrating && index < candlesLit) ? (
                      <motion.div
                        initial={{ y: -10 }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        {/* Lit candle */}
                        <FaBirthdayCake
                          className={`w-8 h-8 transition-colors duration-300 ease-in-out cursor-pointer hover:scale-110`}
                          style={{ color: candleColors[index % candleColors.length] }}
                          onClick={() => lightCandle(index)}
                        />
                      </motion.div>
                    ) : (
                      // Unlit candle
                      <FaBirthdayCake
                        className={`w-8 h-8 text-gray-300 transition-colors duration-300 ease-in-out cursor-pointer hover:scale-110`}
                        onClick={() => lightCandle(index)}
                      />
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </div>
            {/* Balloons section */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-2">Pop the Balloons:</h3>
              <div className="flex justify-center space-x-2">
                {/* Map through balloons */}
                {[...Array(totalBalloons)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 1 }}
                    animate={{ scale: index < balloonsPoppedCount ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Balloon icon */}
                    <GiBalloons
                      className={`w-8 h-8 cursor-pointer hover:scale-110`}
                      style={{ color: index < balloonsPoppedCount ? '#D1D5DB' : balloonColors[index % balloonColors.length] }}
                      onClick={() => popBalloon(index)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
          {/* Card footer with celebrate button */}
          <CardFooter className="flex justify-center">
            <Button 
              className="bg-gradient-to-r from-red-500 to-orange-300 text-white rounded-full hover:bg-gradient-to-l transition-all duration-300"
              onClick={celebrate}
              disabled={celebrating}
            >
              Celebrate! <FaGift className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      {/* Confetti component */}
      {showConfetti && (
        <DynamicConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={5000}
          colors={confettiColors}
        />
      )}
    </div>
  )
}