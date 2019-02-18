<template>
    <div class="container">
        <b-row>
            <b-col>
                <b-btn href="/">← Zurück</b-btn>
            </b-col>
        </b-row>
        <b-row class="mt-4">
            <b-col>
                <h1>{{title}}</h1>
            </b-col>
            <b-col style="text-align: right">
                <b-btn target="_blank" :href="link"
                       class="card-link"
                       variant="primary">Zum Original
                </b-btn>
            </b-col>
        </b-row>
        <b-row class="mt-2">
            <b-col>
                <h2>Text:</h2>
                <p>
                    {{text}}
                </p>
            </b-col>
            <b-col>
                <h2>Metadaten:</h2>
                <p>
                    <strong>Datum:</strong> {{date}}<br>
                    <strong>Bezirk:</strong> {{district}}<br>
                    <strong>Nummer:</strong> {{number}}<br>
                    <strong>Link:</strong> {{link}}
                </p>
            </b-col>
        </b-row>
        <div v-if="similarResults.length > 0">
            <b-row>
                <b-col>
                    <h2>Ähnliche Artikel:</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <ul class="mt-0 pl-1 pr-2 pt-1 pb-2" style="list-style-type: none;">
                        <li v-for="result in similarResults" class="mb-2">
                            <SearchResult :result="result"></SearchResult>
                        </li>
                    </ul>
                </b-col>
            </b-row>
        </div>
    </div>
</template>
<script>
    import http from '../core/http';
    import SearchResult from '@/components/SearchResult.vue'
    import router from "../router";

    export default {
        name: 'Report',
        components: {
            SearchResult: SearchResult
        },
        methods: {
            getData: function () {
                console.log(this.$route.params.id)
                http.get(process.env.VUE_APP_REPORTS_BASE_URL + '/' + encodeURIComponent(this.$route.params.id))
                    .then(response => {
                        if (!response.data)
                            router.push('/404');
                        this.title = response.data.title;
                        this.date = response.data.date;
                        this.district = response.data.district;
                        this.number = response.data.number;
                        this.text = response.data.text;
                        this.link = response.data.link;
                        this.similarResults = response.data.similarResults;
                    }).catch(error => {
                    if (error.response && error.response == 404)
                        router.push('/404')
                });
            }
        },
        mounted: function () {
            this.getData();
        },
        data() {
            return {
                title: 'Mercedes brannte',
                date: '22.12.2018',
                district: 'Treptow-Köpenick',
                number: '2676',
                text: 'Heute früh brannte in Baumschulenweg ein Mercedes. Gegen 3.20 Uhr wurden Polizei und Feuerwehr zu dem brennenden Wagen auf einem Feld in der Neuen Späthstraße alarmiert. Brandbekämpfer löschten die Flammen. Der Pkw brannte komplett aus. Die Ermittlungen hat ein Brandkommissariat beim Landeskriminalamt Berlin übernommen.',
                link: 'https://www.berlin.de/polizei/polizeimeldungen/pressemitteilung.769783.php',
                similarResults: [
                    {
                        title: 'Mercedes brannte',
                        date: '22.12.2018',
                        district: 'Treptow-Köpenick',
                        number: '2676',
                        text: 'Heute früh brannte in Baumschulenweg ein Mercedes. Gegen 3.20 Uhr wurden Polizei und Feuerwehr zu dem brennenden Wagen auf einem Feld in der Neuen Späthstraße alarmiert. Brandbekämpfer löschten die Flammen. Der Pkw brannte komplett aus. Die Ermittlungen hat ein Brandkommissariat beim Landeskriminalamt Berlin übernommen.',
                        link: 'https://www.berlin.de/polizei/polizeimeldungen/pressemitteilung.769783.php'
                    },
                    {
                        title: 'Auf Männer eingestochen - Festnahme',
                        date: '22.12.2018',
                        district: 'Marzahn-Hellersdorf',
                        number: '2678',
                        text: 'In der vergangenen Nacht stach ein Mann in Marzahn auf zwei ihm bekannte Männer ein und verletzte den einen lebensgefährlich und den anderen schwer. Nach derzeitigem Ermittlungsstand geschah die Tat gegen 0.35 Uhr in einem Hauseingangsbereich eines Wohnhauses in der Wörlitzer Straße. Der Täter flüchtete anschließend. Die beiden Verletzten, ein 37- und ein 38-Jähriger, kamen mit alarmierten Rettungswagen in ein Krankenhaus, wo sie zur Behandlung stationär aufgenommen werden mussten. Der Jüngere schwebt immer noch in Lebensgefahr.\nWeitere Ermittlungen führten auf die Spur eines dringend Tatverdächtigen im Alter von 32 Jahren, der heute Vormittag durch ein Spezialeinsatzkommando an seiner Aufenthaltsanschrift in der Wörlitzer Straße festgenommen wurde. Die weiteren Ermittlungen der 5. Mordkommission dauern an.',
                        link: 'https://www.berlin.de/polizei/polizeimeldungen/pressemitteilung.769785.php'
                    }
                ]
            }
        }

    }
</script>
<style scoped>

</style>