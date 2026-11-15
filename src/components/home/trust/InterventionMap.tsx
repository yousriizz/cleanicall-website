'use client';

import { useState } from 'react';
import { departments, mapViewBox } from '@/lib/ile-de-france';
import { contact } from '@/lib/contact';

type Department = (typeof departments)[number];

export function InterventionMap() {
  const [selection, setSelection] = useState<Department>(departments[0]);
  const [highlight, setHighlight] = useState<Department['code'] | null>(null);
  const communeUrl = new URL(contact.whatsapp);
  communeUrl.searchParams.set('text', `Bonjour Cleanic’All, intervenez-vous dans ma commune, dans le département ${selection.name} (${selection.code}) ?`);

  return (
    <section id="zone-intervention" className="trust-section" aria-labelledby="coverage-title">
      <p className="trust-label">Zone d’intervention</p>
      <h2 id="coverage-title">L’Île-de-France, département par département.</h2>
      <div className="trust-coverage">
        <div className="trust-map">
          <svg viewBox={mapViewBox} aria-hidden="true" focusable="false" onPointerLeave={() => setHighlight(null)}>
            {departments.map(department => (
              <path
                key={department.code}
                d={department.path}
                fillRule="evenodd"
                data-department={department.code}
                data-selected={selection.code === department.code}
                data-highlight={highlight === department.code}
                onPointerEnter={() => setHighlight(department.code)}
                onClick={() => setSelection(department)}
              >
                <title>{department.name}</title>
              </path>
            ))}
          </svg>
          <a className="trust-map-source" href="https://www.data.gouv.fr/datasets/contours-administratifs">Contours administratifs · Etalab 2026</a>
        </div>
        <div className="trust-coverage-copy">
          <fieldset className="trust-departments">
            <legend>Choisissez un département</legend>
            {departments.map(department => (
              <label key={department.code} onPointerEnter={() => setHighlight(department.code)} onPointerLeave={() => setHighlight(null)}>
                <input className="sr-only" type="radio" name="department" checked={selection.code === department.code} onChange={() => setSelection(department)} />
                <span><strong>{department.code}</strong> {department.name}</span>
              </label>
            ))}
          </fieldset>
          <div className="trust-coverage-selection" aria-live="polite">
            <h3>{selection.name} <span>({selection.code})</span></h3>
            <p>Les communes desservies restent à confirmer. Indiquez-nous la vôtre pour vérifier votre adresse.</p>
          </div>
          <a className="action-primary action-quote" href={communeUrl.toString()}>Vérifier ma commune</a>
        </div>
      </div>
    </section>
  );
}
