package crystalwars_backend;

enum EffectOn {
    PRE_PLAY,
    PLAY,
    TURN_START,
    TURN_END,
    TURN_END_GRAVEYARD,
    PLAYER_ANY,
    PLAYER_MANA,
    PLAYER_SUMMONING,
    PLAYER_SPELL,
    ENEMY_ANY,
    ENEMY_MANA,
    ENEMY_SUMMONING,
    ENEMY_SPELL,
    DISCARD,
    DESTROY;
}

enum Target {
    PLAYER,
    ENEMY,
    SELF,
    SELECT;
}

enum CardSite {
    DECK {
        @Override
        public CardGroup solve(Player player) {
            return player._deck;
        }
    },
    GRAVEYARD {
        @Override
        public CardGroup solve(Player player) {
            return player._graveyard;
        }
    },
    HAND {
        @Override
        public CardGroup solve(Player player) {
            return player._hand;
        }
    },
    FIELD {
        @Override
        public CardGroup solve(Player player) {
            return player._field;
        }
    };

    public abstract CardGroup solve(Player player);
}

enum MemorySpan {
    TURN {
        @Override
        public PlayerMemory solve(Player player) {
            return player.TURN_STATE;
        }

    },
    GAME {
        @Override
        public PlayerMemory solve(Player player) {
            return player.GAME_STATE;
        }

    };

    public abstract PlayerMemory solve(Player player);
}

enum CurrentState {
    HEALTH {
        @Override
        public int solve(Player player) {
            return player.health;
        }
    },
    MANA {
        @Override
        public int solve(Player player) {
            return player.mana;
        }
    },
    SUMMONINGS {
        @Override
        public int solve(Player player) {
            return player._field.GROUP.size();
        }
    },
    CARDS_ON_HAND{
        @Override
        public int solve(Player player) {
            return player._hand.GROUP.size();
        }
    };

    public abstract int solve(Player player);
}

enum MemoryState {
    HEALED {
        @Override
        public int solve(PlayerMemory state) {
            return state.damageHealed;
        }
    },
    DAMAGE_TAKEN {
        @Override
        public int solve(PlayerMemory state) {
            return state.damageTaken;
        }
    },
    SELF_DAMAGE_TAKEN {
        @Override
        public int solve(PlayerMemory state) {
            return state.selfDamageTaken;
        }
    },
    MANA_SPENT {
        @Override
        public int solve(PlayerMemory state) {
            return state.manaSpent;
        }
    },
    DISCARDED_CARDS {
        @Override
        public int solve(PlayerMemory state) {
            return state.discardedCards;
        }
    },
    GRAVEYARD_CARDS{
        @Override
        public int solve(PlayerMemory state) {
            return state.graveyardCards;
        }     
    };

    public abstract int solve(PlayerMemory state);
}

enum Compare {
    LESS {
        @Override
        public boolean compare(int a, int b) {
            return a < b;
        }
    },
    LESS_OR_EQUALS {
        @Override
        public boolean compare(int a, int b) {
            return a <= b;
        }
    },
    EQUALS {
        @Override
        public boolean compare(int a, int b) {
            return a == b;
        }
    },
    GREATER_OR_EQUALS {
        @Override
        public boolean compare(int a, int b) {
            return a >= b;
        }
    },
    GREATER {
        @Override
        public boolean compare(int a, int b) {
            return a > b;
        }
    };

    public abstract boolean compare(int a, int b);
}

enum Mode {
    ADD {
        @Override
        public int modify(int modifier) {
            return modifier;
        }
    },
    SUBTRACT {
        @Override
        public int modify(int modifier) {
            return -modifier;
        }
    };

    public abstract int modify(int modifier);
}
