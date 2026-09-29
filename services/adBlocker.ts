const AD_DOMAINS = [
  'doubleclick.net', 'googleadservices.com', 'googlesyndication.com',
  'adnxs.com', 'criteo.com', 'outbrain.com', 'taboola.com',
  'popads.net', 'adroll.com', 'adsterra.com', 'propellerads.com',
  'zedo.com', 'serving-sys.com', 'inmobi.com', 'smartadserver.com'
];

const TRACKER_DOMAINS = [
  'google-analytics.com', 'hotjar.com', 'statcounter.com',
  'scorecardresearch.com', 'mixpanel.com', 'segment.io',
  'clarity.ms', 'yandex.ru/metrika'
];

const ADULT_KEYWORDS = [
  'porn', 'xxx', 'sex', 'xvideos', 'xnxx', 'erotic', 'adult',
  'strip', 'camgirl', 'nude', 'redtube', 'brazzers', 'youporn'
];

export class AdBlockService {
  private static blockedAds = 142;
  private static blockedTrackers = 89;

  static isAd(url: string): boolean {
    const lower = url.toLowerCase();
    return AD_DOMAINS.some(domain => lower.includes(domain));
  }

  static isTracker(url: string): boolean {
    const lower = url.toLowerCase();
    return TRACKER_DOMAINS.some(domain => lower.includes(domain));
  }

  static isAdultContent(urlOrQuery: string): boolean {
    const lower = urlOrQuery.toLowerCase();
    return ADULT_KEYWORDS.some(kw => lower.includes(kw));
  }

  static incrementAdsBlocked(count: number = 1): number {
    this.blockedAds += count;
    return this.blockedAds;
  }

  static incrementTrackersBlocked(count: number = 1): number {
    this.blockedTrackers += count;
    return this.blockedTrackers;
  }

  static getStats() {
    return {
      blockedAds: this.blockedAds,
      blockedTrackers: this.blockedTrackers
    };
  }
}
