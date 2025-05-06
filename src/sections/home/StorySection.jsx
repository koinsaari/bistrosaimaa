/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import React, { useEffect, useRef, useState } from 'react';

const storyData = [
  {
    title: 'Kappale 1',
    image: 'https://placehold.co/800x600/?text=Kappale+kuva+1',
    paragraphs: [
      'Ea eu proident quis minim incididunt veniam minim qui voluptate nisi culpa. Sunt commodo nostrud id veniam ad ut nostrud labore. Ad labore nisi quis ea eiusmod minim non anim officia minim consectetur cupidatat. Occaecat sint pariatur consectetur ullamco. Sint ipsum sint deserunt laborum laborum mollit id elit veniam amet duis. Laborum et Lorem quis in.',
      'Aliqua commodo sit cillum elit pariatur eu magna minim reprehenderit esse. Irure nisi sint nostrud eu ut irure fugiat et incididunt officia velit. Consectetur sit eiusmod aute mollit aute consectetur eiusmod id elit.',
    ],
  },
  {
    title: 'Kappale 2',
    image: 'https://placehold.co/800x600/?text=Kappale+kuva+2',
    paragraphs: [
      'Et cupidatat est consequat occaecat proident duis Lorem proident cupidatat officia sunt quis culpa culpa. Et laboris incididunt anim ut nisi consectetur consequat incididunt. In consectetur et irure consequat commodo esse commodo non ipsum sunt. Aute occaecat quis ex labore in adipisicing ullamco ex in fugiat elit irure. In officia dolor commodo reprehenderit consectetur consequat sint do do.',
      'Adipisicing magna sunt est ad ad cillum in. Sunt exercitation consequat eiusmod ipsum. Non velit anim sint proident eu in tempor non sint aliqua.',
    ],
  },
  {
    title: 'Kappale 3',
    image: 'https://placehold.co/800x600/?text=Kappale+kuva+3',
    paragraphs: [
      'In nostrud dolor cillum minim. Labore ea tempor cupidatat magna duis quis do. Non consequat qui aute magna. Eu ipsum dolor dolor magna. Quis officia voluptate minim irure amet ut exercitation aliqua. Exercitation in enim magna reprehenderit minim pariatur ullamco deserunt sunt ad anim commodo voluptate laboris.',
      'Quis laboris et sint cillum consequat. Proident nostrud et ex exercitation commodo enim Lorem laboris velit eiusmod aliquip nisi anim. Esse adipisicing id eiusmod anim et in tempor nostrud mollit incididunt laborum laboris quis. Excepteur non excepteur consequat occaecat. Sunt cupidatat ad proident dolore labore quis consectetur velit anim velit cillum deserunt.',
    ],
  },
];

export default function StorySection() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const cards = containerRef.current.querySelectorAll('.story-card');
    if (!cards.length) return;

    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Array.from(cards).indexOf(entry.target);
          setActiveIndex(idx);
        }
      });
    }, observerOptions);

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="story" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-700">
          Bistro Saimaan tarina
        </h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sticky images */}
          <div className="hidden lg:block lg:w-1/2 lg:pr-8">
            <div className="sticky top-20 h-[80vh]">
              <div className="relative w-full h-full">
                {storyData.map((story, idx) => (
                  <img
                    key={idx}
                    src={story.image}
                    alt={`Bistro Saimaa kuva ${idx + 1}`}
                    className={
                      `absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg transition-opacity duration-700 ease-in-out ` +
                      (activeIndex === idx ? 'opacity-100' : 'opacity-0')
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Story cards */}
          <div ref={containerRef} className="lg:w-1/2 space-y-[80vh]">
            {storyData.map((story, idx) => (
              <div
                key={idx}
                className="story-card bg-white/90 backdrop-blur p-12 rounded-lg shadow-md min-h-[80vh] flex flex-col justify-center"
              >
                <h3 className="text-2xl font-semibold mb-6 text-emerald-700">{story.title}</h3>
                {story.paragraphs.map((text, pIdx) => (
                  <p key={pIdx} className="text-gray-700 leading-relaxed text-lg mb-4">
                    {text}
                  </p>
                ))}
              </div>
            ))}
            {/* Some spacer so last card scrolls fully out before un-sticking */}
            <div className="h-[20vh]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
