<template>
    <div class="container">
        <h1>Willkommen</h1>
            <b-input-group size="lg" prepend="Freie Suche:">
                <b-form-input v-model.trim="searchQuery" v-on:keyup.enter="getResults" placeholder="Suchbegriffe eingeben und mit Enter bestätigen ..."></b-form-input>
                <b-input-group-append>
                    <b-btn v-b-toggle.options v-b-tooltip.hover title="Legen Sie Zeitraum und Ort fest" variant="secondary">⚙ Optionen</b-btn>
                </b-input-group-append>
            </b-input-group>
        <b-collapse id="options" class="mt-2">
        <b-card bg-variant="light">
        <b-form-group horizontal
                       breakpoint="lg"
                       label="Optionen"
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
                <b-form-checkbox-group id="districts" name="districts" v-model="selectedDistricts" :options="districts">
                </b-form-checkbox-group>
            </b-form-group>
            </b-form-group>
        </b-card>
        </b-collapse>
        <b-button class="mt-2 float-right" size="lg" variant="primary" @click="getResults">
            🔎 Suchen
        </b-button>
        {{fullQuery}}
    </div>
</template>

<script>
    import http from './../core/http';

    export default {
        name: 'Default',
        computed: {
            fromDateState () {
                return this.fromActive ? /^[0-9]{4}.[0-9]{2}.[0-9]{2}$/.test(this.fromDate) : null
            },
            toDateState () {
                return this.toActive ? /^[0-9]{4}.[0-9]{2}.[0-9]{2}$/.test(this.toDate) : null
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
                fullQuery: 'bepis',
                results: [
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
        },
        methods: {
            isEmpty(str) {
                return (!str || 0 === str.length);
            },
            buildFullQuery() {
                if(!isEmpty(this.searchQuery)) {
                    this.fullQuery = 'q=' + this.searchQuery;
                }
                if(!isEmpty(this.fromDate)) {
                    this.fullQuery += 'from=' + this.fromDate
                }
                if(!isEmpty(this.toDate)) {
                    this.fullQuery += 'to=' + this.toDate
                }
                if(this.selectedDistricts.length > 0) {
                    this.fullQuery += 'districts=' + this.selectedDistricts
                }
            },
            getResults () {
                buildFullQuery()
            }
        }
    }
</script>

<style scoped="true">
    .container {
        margin-top: 30px;
    }
</style>