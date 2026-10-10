import type { TabId } from './config.js';
import { eventBus } from './events.js';

type RouteHandler = (params: Record<string, string>) => void | Promise<void>;

interface Route {
  pattern: RegExp;
  handler: RouteHandler;
  tab: TabId;
}

class Router {
  private routes: Route[] = [];
  private currentTab: TabId = 'today';
  private currentParams: Record<string, string> = {};
  private beforeHooks: Array<(tab: TabId) => boolean | Promise<boolean>> = [];
  private afterHooks: Array<(tab: TabId) => void | Promise<void>> = [];

  constructor() {
    window.addEventListener('hashchange', () => this.handleHashChange());
    window.addEventListener('load', () => this.handleHashChange());
  }

  addRoute(pattern: string, handler: RouteHandler, tab: TabId): void {
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/:(\w+)/g, '(?<$1>[^/]+)');
    this.routes.push({
      pattern: new RegExp(`^${regexPattern}$`),
      handler,
      tab,
    });
  }

  addBeforeHook(hook: (tab: TabId) => boolean | Promise<boolean>): () => void {
    this.beforeHooks.push(hook);
    return () => {
      const idx = this.beforeHooks.indexOf(hook);
      if (idx >= 0) this.beforeHooks.splice(idx, 1);
    };
  }

  addAfterHook(hook: (tab: TabId) => void | Promise<void>): () => void {
    this.afterHooks.push(hook);
    return () => {
      const idx = this.afterHooks.indexOf(hook);
      if (idx >= 0) this.afterHooks.splice(idx, 1);
    };
  }

  navigate(tab: TabId, params: Record<string, string> = {}): void {
    const hash = this.buildHash(tab, params);
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    } else {
      this.handleHashChange();
    }
  }

  private buildHash(tab: TabId, params: Record<string, string>): string {
    let hash = `#/${tab}`;
    const paramStr = Object.entries(params)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');
    if (paramStr) hash += `?${paramStr}`;
    return hash;
  }

  private parseHash(hash: string): { tab: TabId; params: Record<string, string> } {
    const cleanHash = hash.replace(/^#/, '');
    const [path, query] = cleanHash.split('?');
    const tab = (path.split('/')[1] || 'today') as TabId;
    const params: Record<string, string> = {};
    if (query) {
      new URLSearchParams(query).forEach((v, k) => { params[k] = v; });
    }
    return { tab, params };
  }

  private async handleHashChange(): Promise<void> {
    const { tab, params } = this.parseHash(window.location.hash);

    for (const hook of this.beforeHooks) {
      const canProceed = await hook(tab);
      if (!canProceed) {
        window.location.hash = this.buildHash(this.currentTab, this.currentParams);
        return;
      }
    }

    const previousTab = this.currentTab;
    this.currentTab = tab;
    this.currentParams = params;

    const route = this.routes.find(r => r.pattern.test(tab));
    if (route) {
      try {
        await route.handler(params);
      } catch (error) {
        console.error(`Route handler error for ${tab}:`, error);
        this.navigate('today');
        return;
      }
    }

    for (const hook of this.afterHooks) {
      try {
        await hook(tab);
      } catch (error) {
        console.error(`After hook error for ${tab}:`, error);
      }
    }

    if (previousTab !== tab) {
      eventBus.emit({ type: 'TAB_CHANGED', payload: { tab } });
    }
  }

  getCurrentTab(): TabId {
    return this.currentTab;
  }

  getCurrentParams(): Record<string, string> {
    return { ...this.currentParams };
  }

  getCurrentRoute(): string {
    return window.location.hash;
  }
}

export const router = new Router();