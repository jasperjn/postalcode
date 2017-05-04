<template>
    <main id="app">
        <div class="search">
            <AddressInput />
            <AddressTable />
        </div>
    </main>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "nuxt-class-component"

import AddressInput from "./../components/AddressInput.vue";
import AddressTable from './../components/AddressTable.vue';

import {
    mapState
} from "vuex"

export type Person = {
    first_name: string,
    last_name: string
}

@Component({
    components: {
        AddressInput,
        AddressTable
    }
})
export default class extends Vue {
}

</script>

<style>
* {
    box-sizing: border-box;
}
#app {
    position: absolute;
    left: 0;
    top: 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    bottom: 0;
}
.search {
    width: 100%;
    max-width: 960px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.2);
    padding: 15px;
}
</style>