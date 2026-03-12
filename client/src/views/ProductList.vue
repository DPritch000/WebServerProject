<script setup lang="ts">
import { useProductStore } from '@/stores/products';
import type { Product } from '@/types';
import { ref, onMounted } from 'vue';

const products = ref<Product[]>([]);
const productStore = useProductStore();

onMounted(async () => {
    await productStore.fetchProducts();
    products.value = productStore.products;
});
</script>


<template>
    <h1 class="title is-1">Product List</h1>
    <div class="grid is-col-min-10">
        <div v-for="product in products" :key="product.id" class="box">
            <img :src="product.thumbnail" alt="Product Image" class="image is-4by3">
            <button class="button is-primary is-small add-button">
                Add to Cart
            </button>
            <b>{{ product.title }}</b>
            {{ product.description }}
            <div class="price">{{ product.price }}</div>
        </div>
    </div>
</template>

<style scoped>
.add-button {
    float: right;
    margin-top: .5em;
    ;
}
</style>
