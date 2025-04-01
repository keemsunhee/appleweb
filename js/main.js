(() => {
  let yOffset = 0;
  let prevScrollHeight = 0;
  let currentScene = 0;
  let enterNewScene = false;

  const sceneInfo = [
    {
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        messageC: document.querySelector("#scroll-section-0 .main-message.c"),
        messageD: document.querySelector("#scroll-section-0 .main-message.d"),
        canvas: document.querySelector("#video-canvas-0"),
        context: document.querySelector("#video-canvas-0").getContext("2d"),
        videoImages: [],
      },
      values: {
        videoImageCount: 300,
        imageSequence: [0, 299],
        canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
      },
    },
    {
      type: "normal",
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
      },
    },
    {
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
        canvas: document.querySelector("#video-canvas-1"),
        context: document.querySelector("#video-canvas-1").getContext("2d"),
        videoImages: [],
      },
      values: {
        videoImageCount: 960,
        imageSequence: [0, 959],
      },
    },
    {
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
        canvas: document.querySelector(".image-blend-canvas"),
        context: document.querySelector(".image-blend-canvas").getContext("2d"),
        imagesPath: [
          "./images/blend-image-1.jpg",
          "./images/blend-image-2.jpg",
        ],
        images: [],
      },
      values: {},
    },
  ];

  function setCanvasImages() {
    let imgElem;
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      imgElem = new Image();
      imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
      sceneInfo[0].objs.videoImages.push(imgElem);
    }

    let imgElem2;
    for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
      imgElem2 = new Image();
      imgElem2.src = `./video/002/IMG_${7027 + i}.JPG`;
      sceneInfo[2].objs.videoImages.push(imgElem2);
    }

    let imgElem3;
    for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) {
      imgElem3 = new Image();
      imgElem3.src = sceneInfo[3].objs.imagesPath[i];
      sceneInfo[3].objs.images.push(imgElem3);
    }
  }

  function setLayout() {
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }
      sceneInfo[
        i
      ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.pageYOffset;

    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }

    document.body.setAttribute("id", `show-scene-${currentScene}`);

    sceneInfo[3].objs.canvas.width = window.innerWidth;
    sceneInfo[3].objs.canvas.height = window.innerHeight;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;

    switch (currentScene) {
      case 0:
        let sequence = Math.round(
          values.imageSequence[0] +
            (values.imageSequence[1] - values.imageSequence[0]) *
              (currentYOffset / scrollHeight)
        );
        objs.context.drawImage(objs.videoImages[sequence], 0, 0);
        break;

      case 2:
        let sequence2 = Math.round(
          values.imageSequence[0] +
            (values.imageSequence[1] - values.imageSequence[0]) *
              (currentYOffset / scrollHeight)
        );
        objs.context.drawImage(objs.videoImages[sequence2], 0, 0);
        break;

      case 3:
        const img1 = objs.images[0];
        const img2 = objs.images[1];

        if (img1.complete && img2.complete) {
          const scrollRatio = currentYOffset / scrollHeight;

          objs.context.clearRect(0, 0, objs.canvas.width, objs.canvas.height);

          objs.context.globalAlpha = 1;
          objs.context.drawImage(
            img1,
            0,
            0,
            objs.canvas.width,
            objs.canvas.height
          );

          // ✅ 블렌드 모드를 애니메이션처럼 변경
          const blendMode = scrollRatio < 0.5 ? "screen" : "multiply";
          objs.context.globalCompositeOperation = blendMode;
          objs.context.globalAlpha = scrollRatio;
          objs.context.drawImage(
            img2,
            0,
            0,
            objs.canvas.width,
            objs.canvas.height
          );

          objs.context.globalAlpha = 1;
          objs.context.globalCompositeOperation = "source-over";
        }
        break;
    }
  }

  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0;

    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (yOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return;
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (!enterNewScene) {
      playAnimation();
    }
  }

  window.addEventListener("scroll", () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  });

  window.addEventListener("load", () => {
    setCanvasImages();
    setLayout();
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
    sceneInfo[2].objs.context.drawImage(sceneInfo[2].objs.videoImages[0], 0, 0);

    // scroll-section-3 초기 블렌딩 그리기
    const img1 = sceneInfo[3].objs.images[0];
    const img2 = sceneInfo[3].objs.images[1];
    const ctx = sceneInfo[3].objs.context;
    const canvas = sceneInfo[3].objs.canvas;

    if (img1.complete && img2.complete) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      ctx.drawImage(img1, 0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0;
      ctx.drawImage(img2, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    } else {
      img2.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        ctx.drawImage(img1, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = 0;
        ctx.drawImage(img2, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      };
    }
  });

  window.addEventListener("resize", setLayout);
})();
