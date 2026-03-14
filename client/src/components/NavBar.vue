<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import UserLoginDropdown from '@/components/UserLoginDropdown.vue'

const isActive = ref(false);
</script>

<template>
    <nav class="navbar is-info" role="navigation" aria-label="main navigation">
        <div class="container">
            <div class="navbar-brand">
                <a class="navbar-item" href="https://bulma.io">
                    <img alt="Vue logo" width="30" height="30" src="@/assets/logo.svg" />

                </a>

                <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false"
                   @click="isActive = !isActive" :class="{ 'is-active': isActive }"
                   data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" class="navbar-menu" :class="{ 'is-active': isActive }">
                <div class="navbar-start">
                    <RouterLink to="/" active-class="is-active" class="navbar-item">
                      <span class="icon-text"></span>
                        <span class="icon"></span>
                        <i class="fa-solid fa-person-running"></i>
                       My Activity
                    </RouterLink>

                    <RouterLink to="/statistics" active-class="is-active" class="navbar-item">
                      <span class="icon-text"></span>
                        <span class="icon"></span>
                        <i class="fa-solid fa-chart-simple"></i>
                        Statistics
                    </RouterLink>

                    <RouterLink to="/friendsactivity" active-class="is-active" class="navbar-item">
                      <span class="icon-text"></span>
                        <span class="icon"></span>
                        <i class="fa-solid fa-users-rays"></i>
                        Friends' Activity
                    </RouterLink>

                    <RouterLink to="/peoplesearch" active-class="is-active" class="navbar-item">
                      <span class="icon-text"></span>
                        <span class="icon"></span>
                        <i class="fa-solid fa-magnifying-glass"></i>
                        People Search
                    </RouterLink>

                    <div class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link">
                            Admin
                        </a>

                        <div class="navbar-dropdown">
                            <RouterLink to="/about" active-class="is-active" class="navbar-item">
                                Users
                                <span class="icon-text"></span>
                                <span class="icon"></span>
                                <i class="fa-solid fa-circle-user"></i>
                            </RouterLink>

                        </div>
                    </div>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="buttons">
                            <RouterLink to="/sign-up" active-class="is-active" class="button is-primary">
                                <strong>Sign up</strong>
                            </RouterLink>
                            <UserLoginDropdown />
                            <p class="control">
                              <a
                              class="bd-tw-button button"
                              data-social-network="Twitter"
                              data-social-action="tweet"
                              data-social-target="https://bulma.io"
                              target="_blank"
                              href="http://twitter.com/intent/tweet?text=Bulma: a modern CSS framework on FLexbos&amp;hastags=nulmaio&amp;url=https://bulma.io&amp;via=jgthms"
                              >
                              <span class="icon">
                                <i class="fab fa-twitter"></i>
                              </span>
                              <span>Tweet</span>
                            </a>
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped></style>
