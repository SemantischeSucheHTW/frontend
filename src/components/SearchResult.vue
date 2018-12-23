<template>
    <div>
        <b-card :title="result.title"
                :sub-title="result.date + ' - ' + result.district">
            <p class="card-text">
                {{result.text}}
            </p>
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
        ]
    }
</script>

<style scoped>

</style>