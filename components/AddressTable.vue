<template>
<table class="table">
    <thead>
        <tr>
            <th>縣市</th>
            <th>路段</th>
            <th>範圍</th>
            <th>郵遞區號</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="postalCode in postalCodes">
            <td>{{postalCode.area}}</td>
            <td>{{postalCode.road}}</td>
            <td>{{postalCode.range}}</td>
            <td>{{postalCode.code}}</td>
        </tr>
        <tr v-if="!postalCodes.length">
            <td colspan="4">
                找不到此地點郵遞區號
            </td>
        </tr>
    </tbody>
</table>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'nuxt-class-component';
import {mapState} from "vuex";

@Component({
    computed: {
        ...mapState(['postalCodes'])
    }
})
export default class AddressTable extends Vue {
}
</script>

<style>
.table {
    width: 100%;
    border-collapse: collapse;
}
.table td {
    height: 30px;
}
.table tr:hover td {
    background-color: #e3e3e3;
}
</style>

