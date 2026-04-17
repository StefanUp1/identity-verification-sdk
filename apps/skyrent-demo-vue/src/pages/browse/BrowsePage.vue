<template>
  <main class="demo-page browse-page">
    <h1 class="page-title">SkyRent Drone Rentals</h1>
    <p class="page-subtitle">
      Choose a drone, set how many days you need, then add it to your cart.
    </p>
    <div class="browse-layout">
      <div class="browse-layout__inventory">
        <section class="demo-card">
          <h2>Available drones</h2>
          <div
            v-for="group in groupedInventory"
            :key="group.category"
            class="category-block"
          >
            <h3>{{ group.category }}</h3>
            <div class="inventory-grid">
              <article
                v-for="drone in group.items"
                :key="drone.id"
                class="inventory-item"
              >
                <h4>{{ drone.name }}</h4>
                <p class="muted">{{ drone.description }}</p>
                <p
                  v-if="drone.category === 'Cargo' && drone.loadCapacityKg !== undefined"
                  class="muted"
                >
                  Load capacity: <strong>{{ drone.loadCapacityKg }} kg</strong>
                </p>
                <div class="price-row">
                  <span>Rate (per day)</span>
                  <strong>{{ formatCurrency(drone.dailyRate) }}</strong>
                </div>
                <div class="item-controls">
                  <label :for="`days-${drone.id}`">Rental days</label>
                  <input
                    :id="`days-${drone.id}`"
                    type="number"
                    min="1"
                    max="30"
                    step="1"
                    :value="getDaysForDrone(drone.id)"
                    @change="(event) => handleDraftDaysChange(drone.id, event)"
                  />
                  <button
                    type="button"
                    @click="addDroneToCart(drone)"
                  >
                    Add to cart
                  </button>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>
      <aside
        class="browse-layout__cart"
        :aria-label="`Your cart, ${cart.items.length} ${cart.items.length === 1 ? 'item' : 'items'}`"
      >
        <section class="demo-card cart-panel">
          <h2>
            Your cart <span class="muted">({{ cart.items.length }})</span>
          </h2>
          <p
            v-if="cart.items.length === 0"
            class="muted cart-panel__empty"
          >
            Your cart is empty. Pick a drone from the list to get started.
          </p>
          <div
            v-else
            class="cart-panel__scroll"
          >
            <ul class="cart-list">
              <li
                v-for="item in cart.items"
                :key="item.droneId"
                class="cart-item"
              >
                <div>
                  <strong>{{ item.name }}</strong>
                  <p class="muted">
                    {{ item.days }} {{ item.days === 1 ? "day" : "days" }} at
                    {{ formatCurrency(item.dailyRate) }} / day
                  </p>
                  <p class="muted">
                    Subtotal
                    <strong>{{ formatCurrency(item.dailyRate * item.days) }}</strong>
                  </p>
                </div>
                <div class="cart-actions">
                  <label :for="`cart-days-${item.droneId}`">Rental days</label>
                  <input
                    :id="`cart-days-${item.droneId}`"
                    type="number"
                    min="1"
                    max="30"
                    step="1"
                    :value="item.days"
                    @change="(event) => handleCartDaysChange(item.droneId, event)"
                  />
                  <div class="button-row">
                    <button
                      type="button"
                      @click="removeFromCart(item.droneId)"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="result cart-panel__total">
            <strong>Estimated total:</strong> {{ formatCurrency(cartTotal) }}
          </div>
          <div class="button-row button-row--spaced-sm cart-panel__cta">
            <button
              type="button"
              class="demo-route-link"
              :disabled="!canContinueToVerification"
              :title="canContinueToVerification ? undefined : 'Add at least one drone to your cart to continue.'"
              @click="router.push(ROUTES.verification)"
            >
              Continue to verification
            </button>
          </div>
        </section>
      </aside>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import "../../styles/demo-pages.css";
import "./BrowsePage.css";
import { INVENTORY, type Drone } from "../../domain/inventory";
import { formatCurrency, getCartTotal } from "../../domain/pricing";
import {
  addToCart,
  removeFromCart,
  updateCartDays,
  useCartState,
} from "../../state/cart";
import { ROUTES } from "../../routing/routes";

const router = useRouter();
// Shared reactive store used across all Vue pages (cart, verification, checkout).
const cart = useCartState();
const draftDaysByDroneId = reactive<Record<string, number>>({});

const groupedInventory = computed(() => {
  const filming: Drone[] = [];
  const cargo: Drone[] = [];

  INVENTORY.forEach((drone) => {
    if (drone.category === "Filming") {
      filming.push(drone);
    } else {
      cargo.push(drone);
    }
  });

  return [
    { category: "Filming" as const, items: filming },
    { category: "Cargo" as const, items: cargo },
  ];
});

const cartTotal = computed(() => getCartTotal(cart.items));
const canContinueToVerification = computed(() => cart.items.length > 0);

function normalizeRentalDays(raw: number): number {
  if (!Number.isFinite(raw)) {
    return 1;
  }
  return Math.max(1, Math.min(30, Math.trunc(raw)));
}

function getDaysForDrone(droneId: string): number {
  return draftDaysByDroneId[droneId] ?? 1;
}

function handleDraftDaysChange(droneId: string, event: Event) {
  const target = event.target as HTMLInputElement | null;
  if (!target) {
    return;
  }
  draftDaysByDroneId[droneId] = normalizeRentalDays(Number(target.value));
}

function handleCartDaysChange(droneId: string, event: Event) {
  const target = event.target as HTMLInputElement | null;
  if (!target) {
    return;
  }
  updateCartDays(droneId, normalizeRentalDays(Number(target.value)));
}

function addDroneToCart(drone: Drone) {
  const days = getDaysForDrone(drone.id);
  addToCart(drone, days);
  draftDaysByDroneId[drone.id] = 1;
}
</script>
