var swiper = new Swiper(".mySwiper", {
    autoplay:{
        delay: 5000,
    },
    slidesPerView: 6,
    spaceBetween: 20,
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
  });