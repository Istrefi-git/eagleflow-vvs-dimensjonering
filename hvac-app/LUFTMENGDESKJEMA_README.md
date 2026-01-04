# Luftmengdeskjema - Implementasjonsoppsummering

## Oversikt
Luftmengdeskjema er nå implementert som en underaktivitet under Ventilasjon i Dashboard. Implementasjonen er basert på Excel-arket "Luftmengdeberegning.xlsx" (Alternativ 2 + Sum Ventilasjonssystem).

## Implementerte komponenter

### 1. Beregningsmotor (`src/lib/ventilation/airflowCalculations.js`)
Implementerer alle Excel-formlene:
- **TEK17 Foreløpig luftmengde (J)**: `IF(H>0, H, (C*F) + (E*G))`
- **Kravspek (K)**: `IF(AND(C>0, I>0), C*I, "")`
- **Valgt Avtrekk (M)**: `M = L`
- **VAV Min (P)**: `P = O * P11`
- **Kontroll (R)**: `IF(AND(L>0, C>0), L/C, "")`
- **Kjøleeffekt (T)**: `IFERROR((L/3600)*1.205*1.005*(T15-T14)*1000, 0)`
- **Summer**: Beregner totaler for alle felt
- **Systemgruppering**: Grupperer per systemnr og summerer (basert på "Sum Ventilasjonssystem")

### 2. Lagringslag (`src/lib/ventilation/airflowStorage.js`)
Håndterer localStorage-operasjoner:
- Lagrer data per prosjekt med prefix `eagleflow_airflow_`
- Støtter CRUD-operasjoner for romlinjer
- Håndterer prosjektmetadata og globale konstanter
- Automatisk initialisering av nye prosjekter

### 3. UI-komponent (`src/components/ventilation/AirflowSchedule.jsx`)
Mobilvennlig brukergrensesnitt:
- **Prosjektvelger**: Automatisk lasting av siste valgte prosjekt
- **Konstantredigering**: Modal for å justere A, B, VAV-min faktor, temperaturer
- **Prosjektinfo**: Modal for metadata (prosjektnavn, ordre nr, etc.)
- **Romlinjer**: Card-basert layout for mobil, med alle felt og beregnede verdier
- **Legg til/Rediger**: Modaler for å legge til og redigere romlinjer
- **Summer**: Viser totaler for alle felt
- **Systemgruppering**: Collapsible seksjon per systemnr med summer

### 4. Dashboard-integrasjon (`src/components/Dashboard.jsx`)
- Ventilasjon-menyen er nå collapsible med undermeny
- Lenke til Luftmengdeskjema under Ventilasjon

### 5. Routing (`src/App.jsx`)
- Ny route: `/ventilation/airflow-schedule`

## Datamodell

### Globale konstanter (defaults)
```javascript
{
  A_m3h_per_m2: 3.6,           // Ventilasjon for materialer
  B_m3h_per_person: 26,        // Ventilasjon for personer
  vavMinFactor: 0.2,           // VAV minimum faktor
  tTilluft_C: 18,              // Tillufttemperatur
  tAvtrekk_C: 26               // Avtrekkstemperatur
}
```

### Romlinje
```javascript
{
  id: number,                   // Auto-generert
  plan: string,                 // Plan/etasje
  romnr: string,                // Romnummer
  areal_m2: number,             // C: Areal (m²)
  romnavn: string,              // Romnavn/funksjon
  personer: number,             // E: Antall personer
  prosess_m3h: number,          // H: Prosessluft (m³/h)
  kravspek_m3h_per_m2: number,  // I: Kravspek (m³/h/m²)
  valgtTilluft_m3h: number,     // L: Valgt tilluft (m³/h)
  systemnr: string,             // N: Systemnummer
  vavMaks_m3h: number,          // O: VAV maks (m³/h)
  cavKonstant_m3h: number,      // Q: CAV konstant (m³/h)
  kommentar: string,            // Kommentar
  calculated: {                 // Beregnede felt
    tek17Forelopig_m3h: number,
    kravspek_m3h: number|null,
    valgtAvtrekk_m3h: number,
    vavMin_m3h: number,
    kontroll_m3h_per_m2: number|null,
    kjoleeffekt_W: number
  }
}
```

## Bruk

1. **Logg inn** og velg et prosjekt fra Dashboard
2. **Klikk på Ventilasjon** i sidebar for å ekspandere menyen
3. **Velg Luftmengdeskjema** fra undermenyen
4. **Juster konstanter** om nødvendig (A, B, VAV-min, temperaturer)
5. **Legg til romlinjer** med "Legg til rom"-knappen
6. **Se beregninger** automatisk oppdatert for hver romlinje
7. **Se summer** og systemgruppering nederst på siden

## Mobilvennlighet
- Card-basert layout for romlinjer
- Responsive grid for felt
- Touch-vennlige knapper og modaler
- Fungerer godt på både mobil og desktop

## Testing
Utviklingsserver kjører på: `http://localhost:5173/`

Test følgende:
1. ✅ Navigasjon fra Dashboard → Ventilasjon → Luftmengdeskjema
2. ✅ Legg til romlinjer med ulike verdier
3. ✅ Rediger eksisterende romlinjer
4. ✅ Slett romlinjer
5. ✅ Juster globale konstanter
6. ✅ Legg til prosjektinfo
7. ✅ Verifiser at beregninger matcher Excel-formlene
8. ✅ Test på mobil (responsive design)
9. ✅ Test systemgruppering med ulike systemnr
10. ✅ Verifiser at data lagres og lastes korrekt per prosjekt

## Neste steg (valgfritt)
- Eksport til Excel/PDF
- Import fra Excel
- Flere visualiseringer (grafer/diagrammer)
- Historikk/versjonering
- Samarbeidsfunksjoner (sanntidsoppdateringer)

