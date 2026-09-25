/** Hem tarayıcıda hem sunucuda geçerli fotoğraf sınırları. */

export const MAKS_FOTO_MB = 10;

/** 358–405 px'lik test fotoğrafları yüzü bozuk üretti; alt sınır bu yüzden var. */
export const MIN_FOTO_KENAR = 512;

/** Tarayıcı fotoğrafı göndermeden önce uzun kenarı bu boyuta indirir. */
export const GONDERIM_MAKS_KENAR = 1536;
