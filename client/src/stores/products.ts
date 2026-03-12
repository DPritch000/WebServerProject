
import { defineStore } from "pinia"
import type { Product } from "../types"
import { ref } from "vue"

export const useProductStore = defineStore("product", () => {
    const products = ref<Product[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchProducts = async () => {
        loading.value = true
        error.value = null
        try {
            const res = await fetch('https://dummyjson.com/products')
            const data = await res.json()
            products.value = data.products
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch products'
        } finally {
            loading.value = false
        }
    }

    return { products, loading, error, fetchProducts }
})
