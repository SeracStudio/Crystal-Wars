package crystalwars_backend;

enum EffectOn{
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

enum Target{
    PLAYER,
    ENEMY,
    SELF,
    SELECT;
}

enum CardSite{
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

enum CurrentState{
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

enum MemoryState{
    HEALED {
        @Override
        public int solve(PlayerState state) {
            return state.healed;
        }
    },
    DAMAGE_TAKEN {
        @Override
        public int solve(PlayerState state) {
            return state.damageTaken;
        }
    },
    SELF_DAMAGE_TAKEN {
        @Override
        public int solve(PlayerState state) {
            return state.selfDamageTaken;
        }
    },
    MANA_SPENT {
        @Override
        public int solve(PlayerState state) {
            return state.manaSpent;
        }
    },
    DISCARDED_CARDS {
        @Override
        public int solve(PlayerState state) {
            return state.discardedCards;
        }
    },
    GRAVEYARD_CARDS{
        @Override
        public int solve(PlayerState state) {
            return state.graveyardCards;
        }     
    };

    public abstract int solve(PlayerState state);
}

enum MemorySpan{
    TURN {
        @Override
        public PlayerState solve(Player player) {
            return player.TURN_STATE;
        }

    },
    GAME {
        @Override
        public PlayerState solve(Player player) {
            return player.GAME_STATE;
        }

    };

    public abstract PlayerState solve(Player player);
}

enum Compare{
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

enum Mode{
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
