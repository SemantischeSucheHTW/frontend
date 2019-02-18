<template>
    <div>
        <b-container class="container">
            <h1>Willkommen zur Polizeiberichtsuche Berlin</h1>
            <p>Die gewünschte Seite wurde nicht gefunden (Error Code 404).</p>
            <b-btn variant="primary" href="/">Zurück zur Startseite</b-btn>
        </b-container>
    </div>
</template>
<script>
    import http from '../core/http';

    export default {
        name: 'Report',
        mounted: {

        },
        data () {
            return {
                collapsed: true,
                articlesShown: false
            }
        }
    }
</script>
<style scoped>

</style>