'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { useTranslations } from 'next-intl'
import { SectionEntrance } from '@/components/MotionSection'
import { GEO } from '@/config/site'

const MAP_CENTER = { lat: GEO.latitude, lng: GEO.longitude }
const GEOCODE_ADDRESS = 'Celestrina 19, Malečnik, Slovenia'

const CIRCLE_CONFIGS = [
  { radius: 200000, fillColor: '#e53935', km: 200, priceKey: 'perKm' as const, priceValue: '0.40€' },
  { radius: 100000, fillColor: '#1e88e5', km: 100, priceKey: 'perKm' as const, priceValue: '0.50€' },
  { radius: 50000, fillColor: '#43a047', km: 25, priceKey: 'free' as const, priceValue: '' },
] as const
const LEGEND_CONFIGS = [...CIRCLE_CONFIGS].reverse()
const FILL_OPACITY = 0.2

const MAP_ID =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID?.trim() || 'DEMO_MAP_ID'

const MAP_OPTIONS: google.maps.MapOptions = {
  center: MAP_CENTER,
  zoom: 9,
  mapId: MAP_ID,
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: false,
  fullscreenControl: true,
}

type LatLng = { lat: number; lng: number }

function getGeocodeLocation(
  result: google.maps.GeocoderResult
): LatLng | null {
  const loc = result.geometry?.location
  return loc ? { lat: loc.lat(), lng: loc.lng() } : null
}

export default function MapSection() {
  const t = useTranslations('map')
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [mapLoadFailed, setMapLoadFailed] = useState(false)
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(GEOCODE_ADDRESS)}`

  useEffect(() => {
    window.localStorage.removeItem('ashine.mapConsent')
    if (typeof google !== 'undefined' && google.maps) {
      setScriptLoaded(true)
    }
    // Fired when the API key is invalid or HTTP referrer is not allowed (common on production).
    const w = window as Window & { gm_authFailure?: () => void }
    const prevAuthFailure = w.gm_authFailure
    w.gm_authFailure = () => {
      console.error(
        'Google Maps auth failed - check API key, billing, enabled APIs, and HTTP referrer restrictions for this domain.',
      )
      setMapLoadFailed(true)
      prevAuthFailure?.()
    }
    return () => {
      w.gm_authFailure = prevAuthFailure
    }
  }, [])

  useEffect(() => {
    if (!scriptLoaded || typeof google === 'undefined') return
    const container = containerRef.current
    if (!container) return

    let cancelled = false

    const init = async () => {
      try {
        const [{ Map, Circle, RenderingType }, { AdvancedMarkerElement }, { Geocoder }] =
          await Promise.all([
            google.maps.importLibrary('maps') as Promise<google.maps.MapsLibrary>,
            google.maps.importLibrary('marker') as Promise<google.maps.MarkerLibrary>,
            google.maps.importLibrary('geocoding') as Promise<google.maps.GeocodingLibrary>,
          ])
        if (cancelled) return

        // Raster avoids "Vector Map failed, falling back to Raster" when WebGL is blocked
        // (Brave shields, devtools mobile emulation, some GPUs). mapId still enables Advanced Markers.
        const map = new Map(container, {
          ...MAP_OPTIONS,
          renderingType: RenderingType.RASTER,
        })
        mapRef.current = map

        const placeMarkerAndCircles = (center: LatLng) => {
          new AdvancedMarkerElement({ position: center, map, title: t('address') })
          CIRCLE_CONFIGS.forEach(({ radius, fillColor }) => {
            new Circle({
              map,
              center,
              radius,
              fillColor,
              fillOpacity: FILL_OPACITY,
              strokeColor: fillColor,
              strokeOpacity: 0.4,
              strokeWeight: 1,
            })
          })
          map.setCenter(center)
        }

        new Geocoder().geocode({ address: GEOCODE_ADDRESS }, (results, status) => {
          if (cancelled) return
          const center =
            status === 'OK' && results?.[0]
              ? getGeocodeLocation(results[0])
              : null
          placeMarkerAndCircles(center ?? MAP_CENTER)
        })
      } catch (err) {
        console.error('Google Maps init failed:', err)
        if (!cancelled) setMapLoadFailed(true)
      }
    }

    init()

    return () => {
      cancelled = true
      mapRef.current = null
    }
  }, [scriptLoaded, t])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    return (
      <SectionEntrance id="map" className="section-padding bg-premium-charcoal" aria-labelledby="map-heading">
        <div className="container-narrow text-center py-16">
          <h2 id="map-heading" className="text-h2 text-text-primary mb-2">{t('noKeyHeading')}</h2>
          <p className="text-text-muted text-body-sm">
            {t('noKeyHint')}
          </p>
          <p className="text-text-muted text-body-sm mt-2">
            {t('address')}
          </p>
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center rounded-sharp border border-border-default bg-premium-slate px-4 py-2.5 text-body-sm font-medium text-text-primary transition-colors hover:border-premium-accent hover:text-premium-accent"
          >
            {t('openInGoogleMaps')}
          </a>
        </div>
      </SectionEntrance>
    )
  }

  return (
    <>
      <Script
        id="google-maps-bootstrap"
        strategy="afterInteractive"
        onError={() => setMapLoadFailed(true)}
        onLoad={() => {
          setScriptLoaded(true)
          setMapLoadFailed(false)
        }}
        dangerouslySetInnerHTML={{
          __html: `(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=\`https://maps.\${c}apis.com/maps/api/js?\`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({key:${JSON.stringify(apiKey)},v:"weekly"});`,
        }}
      />
      <SectionEntrance id="map" className="section-padding bg-premium-charcoal" aria-labelledby="map-heading">
        <div className="container-narrow">
          <header className="text-center mb-8">
            <p className="text-premium-accent text-overline uppercase mb-2">{t('overline')}</p>
            <h2 id="map-heading" className="text-h2 text-text-primary">
              {t('heading')}
            </h2>
            <p className="mt-3 text-body text-text-secondary max-w-xl mx-auto">
              {t('subheading')}
            </p>
          </header>
          {mapLoadFailed ? (
            <div className="w-full rounded-card border border-border-default bg-premium-slate p-8 text-center">
              <h3 className="text-h4 text-text-primary mb-2">{t('fallbackHeading')}</h3>
              <p className="text-body-sm text-text-secondary max-w-xl mx-auto">
                {t('fallbackHint')}
              </p>
              <p className="text-text-muted text-body-sm mt-3">{t('address')}</p>
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center justify-center rounded-sharp border border-border-default bg-premium-black/40 px-4 py-2.5 text-body-sm font-medium text-text-primary transition-colors hover:border-premium-accent hover:text-premium-accent"
              >
                {t('openInGoogleMaps')}
              </a>
            </div>
          ) : (
            <div
              ref={containerRef}
              className="w-full h-[400px] sm:h-[480px] rounded-card overflow-hidden border border-border-default bg-premium-slate"
              aria-hidden
            />
          )}

          <div className="mt-6 rounded-card border border-border-default bg-premium-slate/80 p-4 sm:p-5 text-center">
            <p className="text-body-sm font-semibold text-text-primary mb-3">{t('legendTitle')}</p>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:gap-x-8 text-body-sm text-text-secondary" role="list">
              {LEGEND_CONFIGS.map(({ fillColor, km, priceKey, priceValue }) => (
                <li key={km} className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-full shrink-0 border border-white/20"
                    style={{ backgroundColor: fillColor, opacity: 0.9 }}
                    aria-hidden
                  />
                  <span>
                    <strong className="text-text-primary">{km} km</strong>
                    <span className="mx-1.5 text-text-muted">-</span>
                    <span className={priceKey === 'free' ? 'text-premium-accent font-medium' : ''}>
                      {priceKey === 'free' ? t('free') : t('perKm', { price: priceValue })}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-body-sm text-text-muted max-w-2xl mx-auto leading-relaxed">
              {t('travelDiscountNote')}
            </p>
          </div>
        </div>
      </SectionEntrance>
    </>
  )
}
