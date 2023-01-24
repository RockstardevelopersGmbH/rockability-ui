<script>/**
 * An accessible slide component which should be used with the @component Slider.
 *
 *  @component
 */
import { SwiperSlide } from 'swiper/svelte';
/**
 * Use this property to add custom classes and stylings to the component.
 */
export let className = '';
</script>

<SwiperSlide class="slide-swiper-slide {className || ''}">
	<slot />
</SwiperSlide>

<style>:global(.swiper-slide) {
  box-sizing: border-box;
}</style>
