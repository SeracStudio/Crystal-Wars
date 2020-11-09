package crystalwars_backend;

class OnCurrent extends PlayerTargetModifier {

    private final CurrentState STATE;

    public OnCurrent(Target target, CurrentState state, Mode mode) {
        super(target, mode);
        STATE = state;
    }

    @Override
    public int getModifier() {
        return MODE.modify(STATE.solve(solvedTarget));
    }
}

class OnMemory extends PlayerTargetModifier {

    private final MemorySpan SPAN;
    private final MemoryState MEMORY_STATE;

    public OnMemory(MemorySpan span, Target target, MemoryState state, Mode mode) {
        super(target, mode);
        SPAN = span;
        MEMORY_STATE = state;
    }

    @Override
    public int getModifier() {
        return MODE.modify(MEMORY_STATE.solve(SPAN.solve(solvedTarget)));
    }
}

class OnCardCost extends CardTargetModifier {
    public OnCardCost(Target target, Mode mode){
        super(target, mode);
    }

    @Override
    public int getModifier() {
        return MODE.modify(solvedTarget.cost);
    }
}

class LastPeekedCardCost extends PlayerTargetModifier {

    public final MemorySpan SPAN;

    public LastPeekedCardCost(MemorySpan span, Target target, Mode mode) {
        super(target, mode);
        SPAN = span;
    }

    @Override
    public int getModifier() {
        return MODE.modify(SPAN.solve(solvedTarget).lastPeekedCard.cost);
    }
}

class LastTributedCardCost extends PlayerTargetModifier {

    public final MemorySpan SPAN;

    public LastTributedCardCost(MemorySpan span, Target target, Mode mode) {
        super(target, mode);
        SPAN = span;
    }

    @Override
    public int getModifier() {
        return MODE.modify(SPAN.solve(solvedTarget).lastTributedCard.cost);
    }
}
