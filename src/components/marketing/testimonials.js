'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 't0',
    name: 'Ayesha R.',
    role: 'Frontend Developer, hired at a Series A startup',
    quote:
      "The technical rounds used to wreck me — I'd freeze on follow-up questions. After a week of sessions that kept circling back to the same closures and async questions I kept flubbing, I walked into my real interview and actually recognized the pattern.",
  },
  {
    id: 't1',
    name: 'Daniyal K.',
    role: 'Backend Engineer',
    quote:
      "What got me was the communication score. I always assumed my answers were fine technically and that was enough. Seeing 'technical: 90%, communication: 62%' laid out separately was the wake-up call I needed.",
  },
  {
    id: 't2',
    name: 'Sara M.',
    role: 'Product Designer',
    quote:
      'I practice out loud on my commute using voice mode. It genuinely feels like talking to an interviewer instead of reading flashcards, and the sample answers after each session gave me phrasing I actually reused.',
  },
  {
    id: 't3',
    name: 'Hamza T.',
    role: 'New grad, first full-time offer',
    quote:
      'I had zero real interview experience going in. Doing four or five mock rounds before the real one meant the actual interview was the least nerve-wracking part of my week.',
  },
];

export function Testimonials() {
  const [startIndex, setStartIndex] = useState(0);

  function prevSlide() {
    setStartIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  }

  function nextSlide() {
    setStartIndex((prev) => (prev + 1) % testimonials.length);
  }

  // 3 visible testimonials create karne ke liye array slicing / wrapping
  const visibleTestimonials = [
    testimonials[startIndex],
    testimonials[(startIndex + 1) % testimonials.length],
    testimonials[(startIndex + 2) % testimonials.length],
  ];

  return (
    <div className="relative mx-auto max-w-6xl px-4">
      {/* 3 Grid items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleTestimonials.map((t, i) => (
          <div
            key={`${t.id}-${i}`}
            className="flex flex-col justify-between rounded-2xl p-6 transition-all duration-300"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-elevated)',
            }}
          >
            <div>
              <Quote
                className="h-7 w-7 mb-4"
                style={{ color: 'var(--color-primary-500)' }}
              />
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--foreground)' }}
              >
                {t.quote}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{
                  background:
                    'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
                }}
              >
                {t.name.charAt(0)}
              </div>
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: 'var(--foreground)' }}
                >
                  {t.name}
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {t.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous testimonials"
        className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200 hover:bg-[var(--muted)] z-10"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
        }}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next testimonials"
        className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200 hover:bg-[var(--muted)] z-10"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
        }}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Pagination Dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {testimonials.map((dot, i) => (
          <button
            key={dot.id}
            type="button"
            onClick={() => setStartIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
              i === startIndex ? 'w-5' : 'w-2'
            }`}
            style={{
              background:
                i === startIndex
                  ? 'var(--color-primary-500)'
                  : 'var(--border)',
            }}
          />
        ))}
      </div>
    </div>
  );
}