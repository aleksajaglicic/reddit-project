import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TextEffect = () => {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const textElements = Array.from(document.querySelectorAll<HTMLElement>('.text'));

        textElements.forEach((text) => {
            gsap.to(
                text, {
                backgroundSize: '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: text,
                    start: 'center 80%',
                    end: 'center 20%',
                    scrub: true,
                },
            });
        });
    }, []);

    return (
        <div className="container">
            <h1 className="text">TEXT EFFECT<span>WOAH</span></h1>
        </div>
    );
};

export default TextEffect;
