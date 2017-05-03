<template>
<section>
    <div>
        <AddressInput />
        <AddressTable />
    </div>
</section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "nuxt-class-component"
import axios from "~plugins/axios"

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