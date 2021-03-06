package crystalwars_backend;

import java.util.HashMap;
import java.util.Map;

enum CardType{
	MANA, SUMMONING, SPELL
}

public enum CardCollection{
	SELECT(0), ORBE_DE_MANA_AGUA(1), PAREJA_DE_ORBES_AGUA(2), MANANTIAL_DE_LA_VIDA(3), CALIZ_DE_CORAL(4), RESACA(5),
	PUPILO_DE_LAS_MAREAS(6), OSTRA_REFUERZO(7), ORACULO_DEL_OCEANO(8), GEISER(9), PLUVIAM(10),
	ORBE_DE_MANA_FUEGO(11), PAREJA_DE_ORBES_FUEGO(12), CALDERO_DE_LAVA(13), GLIFO_FUEGOSCURO(14), BUSCALLAMAS(15),
	BASILISCO_DURMIENTE(16), PUERTAS_DEL_TARTARO(17), CABALLERO_LEAL(18), IGNIS(19), LEVIORES(20),
	ORBE_DE_MANA_VIENTO(21), PAREJA_DE_ORBES_VIENTO(22), KUMO(23), SORA_EL_ALADO(24), SILBATO_CEFIRO(25),
	APUESTA_DEL_VIENTO(26), PERIPLO_EFIMERO(27), TROTABRISAS(28), NOTOS(29), CAELI(30), ORBE_DE_MANA_TIERRA(31),
	PAREJA_DE_ORBES_TIERRA(32), GARGOLA_CALIZA(33), BACULO_PETREO(34), DESTRUCCION_DE_PANGEA(35),
	GUARDIAN_DE_BASALTO(36), BATALLON_MERCENARIO(37), FOSA_TECTONICA(38), GORE_EL_TORTURADOR(39), DOTON(40),
	WAIN_EL_COPERO(41), EQUILIBRAR_LA_BALANZA(42), ELECCION_DE_DIOS(43), JOKY_EL_BUFON(44), BLOQUEO_CELESTIAL(45),
	TRUENO_DE_ARKE(46), SACRIFICIO_DIVINO(47), MIRADA_ETERNA(48);

	public final int ID;
	private static final Map<Integer, CardCollection> coll = new HashMap<>(values().length, 1);
	static {
		for (CardCollection c : values())
			coll.put(c.ID, c);
	}

	private CardCollection(int id) {
		this.ID = id;
	}

	public static CardCollection get(int ID) {
		return coll.get(ID);
	}
}