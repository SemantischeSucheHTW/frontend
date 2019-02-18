<template>
    <div>
        <b-card :title="result.title"
                :sub-title="result.date + ' - ' + result.district">
            <p v-show="collapsed" class="card-text">
                {{result.text.substring(0, 140)}}
                <b-link v-on:click="collapsed = false" style="font-style: italic" href="#">... mehr anzeigen</b-link>
            </p>
            <p v-show="!collapsed" class="card-text">
                {{result.text}}
            </p>
            <b-link
                    :href="'/reports/' + encodeURIComponent(result.link)"
                    class="card-link">Zur Detailseite</b-link>
            <b-link target="_blank" :href="result.link"
                    class="card-link">Zum Original</b-link>
        </b-card>
    </div>
</template>
<script>
    export default {
        name: 'SearchResult',
        props: [
            'result'
        ],
        data () {
            return {
                collapsed: true
            }
        }
    }
</script>

<style scoped>

</style>