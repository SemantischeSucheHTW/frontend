<template>
    <div class="container">
        <h1>Willkommen zur Polizeiberichtsuche Berlin</h1>
        <b-input-group size="lg" prepend="Freie Suche:">
            <b-form-input v-model.trim="searchQuery"
                          placeholder="Suchbegriffe eingeben ..."
            ></b-form-input>
            <b-input-group-append>
                <b-btn v-b-toggle.options v-b-tooltip.hover title="Legen Sie Zeitraum und Ort fest" variant="secondary">
                    ⚙ Suche eingrenzen
                </b-btn>
            </b-input-group-append>
        </b-input-group>
        <b-collapse id="options" class="mt-2">
            <b-card bg-variant="light">
                <b-form-group horizontal
                              breakpoint="lg"
                              label="Suche eingrenzen"
                              label-size="lg"
                              label-class="font-weight-bold pt-0"
                              class="mb-0">
                    <b-input-group>
                        <b-input-group-prepend is-text>
                            <input class="mr-sm-2" type="checkbox" v-model="fromActive"> Von:
                        </b-input-group-prepend>
                        <b-form-input class="mb-2 mr-sm-2 mb-sm-0"
                                      v-model="fromDate"
                                      type="date"
                                      :state="fromDateState"
                                      :readonly="!fromActive"
                                      id="selectFromDate"
                                      aria-describedby="fromDateLiveFeedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="fromDateLiveFeedback">
                            Bitte ein valides Datum eingeben.
                        </b-form-invalid-feedback>
                    </b-input-group>
                    <b-input-group class="mt-2">
                        <b-input-group-prepend is-text>
                            <input class="mr-sm-2" type="checkbox" v-model="toActive"> Bis:
                        </b-input-group-prepend>
                        <b-form-input class="mb-2 mr-sm-2 mb-sm-0"
                                      v-model="toDate"
                                      type="date"
                                      :readonly="!toActive"
                                      :state="toDateState"
                                      id="selectFromDate"
                                      aria-describedby="toDateLiveFeedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="toDateLiveFeedback">
                            Bitte ein valides Datum eingeben.
                        </b-form-invalid-feedback>
                    </b-input-group>
                    <b-form-group class="mt-2" label="Bezirke:">
                        <b-form-checkbox-group id="districts" name="districts" v-model="selectedDistricts"
                                               :options="districts">
                        </b-form-checkbox-group>
                    </b-form-group>
                </b-form-group>
            </b-card>
        </b-collapse>
        <div class="mt-2 mb-2" v-if="activeCorrections.length > 0">
            <h5>Rechtschreibkorrektur:</h5>
            <ul v-for="correction in activeCorrections" style="list-style-type: none;" class="mb-0">
                <li v-for="suggestion in correction.suggestions">
                    <b-link v-on:click="applyCorrection(correction.word, suggestion)">
                        {{correction.word}} → {{suggestion}}
                    </b-link>
                </li>
            </ul>
        </div>
        <b-button class="mt-2" size="lg" variant="primary" @click="getResults">
            🔎 Suchen
        </b-button>
        <ul v-if="results.length > 0" class="mt-3 pl-2 pr-2 pt-2 pb-2" style="list-style-type: none;">
            <li v-for="result in results" class="mb-2">
                <SearchResult :result="result"></SearchResult>
            </li>
        </ul>
        <b-alert :show="!(!error)" dismissible variant="danger">
            {{error}}
        </b-alert>
    </div>
</template>

<script>
    import http from './../core/http';
    import SearchResult from '@/components/SearchResult.vue'

    export default {
        name: 'Default',
        components: {
            SearchResult: SearchResult
        },
        computed: {
            fromDateState() {
                return this.fromActive ? /^[0-9]{4}.[0-9]{2}.[0-9]{2}$/.test(this.fromDate) : null
            },
            toDateState() {
                return this.toActive ? /^[0-9]{4}.[0-9]{2}.[0-9]{2}$/.test(this.toDate) : null
            },
            activeCorrections() {
                return this.corrections.filter(value => this.searchQuery.includes(value.word));
            }
        },
        data() {
            const now = new Date();
            const nowFormatted = now.getUTCFullYear() + '-' + (now.getUTCMonth() + 1 < 10 ? '0' + (now.getUTCMonth() + 1) : (now.getUTCMonth()) + 1) + '-' + now.getUTCDate();
            return {
                fromDate: 'dd.mm.yyyy',
                fromActive: false,
                toDate: 'dd.mm.yyyy',
                toActive: false,
                districts: ['Charlottenburg', 'Mitte', 'Grunewald', 'Friedrichshain'],
                selectedDistricts: [],
                searchQuery: '',
                fullQuery: new URLSearchParams(),
                error: false,
                results: [
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
                ],
                corrections: [
                    {
                        word: 'was',
                        suggestions: ['das', 'krass']
                    },
                    {
                        word: 'geht',
                        suggestions: ['gehen']
                    }
                ]
            }
        },
        methods: {
            getResults() {

                if (!(!this.searchQuery || 0 === this.searchQuery.length))
                    this.fullQuery.append('q', this.searchQuery.split(' ').join('+'));

                if (this.fromDateState)
                    this.fullQuery.append('from', this.fromDate);

                if (this.toDateState)
                    this.fullQuery.append('to', this.toDate);

                if (this.selectedDistricts.length > 0)
                    this.fullQuery.append('districts', this.selectedDistricts.join(','));

                http.get('/report', {
                    params: this.fullQuery
                }).then(response => {
                    this.error = false;
                    this.results = response.data;
                }).catch(error => {
                    this.error = error;
                });
            },
            getCorrections() {
                http.get('/corrections?query=' + this.searchQuery.split(' ').join('+'))
                    .then(response => {
                        this.corrections = response.data;
                    }).catch(error => {
                        this.error = error
                });
            },
            applyCorrection(word, correction) {
                this.searchQuery = this.searchQuery.replace(word, correction);
            }
        },
        watch: {
            searchQuery: function () {
                this.getResults();
                this.getCorrections();
            }
        }
    }
</script>

<style scoped="true">
    .container {
        margin-top: 30px;
    }
</style>