const path = document.getElementById("spiral");
        const group = document.getElementById("letters");

        const pathLength = path.getTotalLength();

        const spacing = 60;
        const letterCount = Math.floor(pathLength / spacing);

        let offset = 0;
        const speed = 3;

        const letters = [];

        for (let i = 0; i < letterCount; i++) {
            const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
            t.textContent = "A";
            t.setAttribute("class", "letter");
            group.appendChild(t);
            letters.push(t);
        }

        function animate() {

            offset = (offset - speed + pathLength) % pathLength;

            letters.forEach((letter, i) => {
                const basePos = i * spacing;
                const pos = (basePos + offset) % pathLength;
                const point = path.getPointAtLength(pos);
                let progress = pos / pathLength;
                progress = 1 - progress;
                const eased = progress * progress;
                const size = 16 + eased * 64;
                const minOpacity = 0.7;
                const opacity = minOpacity + eased * (1 - minOpacity);

                letter.setAttribute("x", point.x);
                letter.setAttribute("y", point.y);
                letter.setAttribute("font-size", size);
                letter.setAttribute("opacity", opacity);

            });

            requestAnimationFrame(animate);
        }

        animate();
