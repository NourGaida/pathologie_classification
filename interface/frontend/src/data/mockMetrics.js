/** Métriques — best_densenet121_meta.json (densenet121-seuiltbadel.ipynb) */
export const modelKPIs = {
  accuracy: 88,
  macroF1: 0.120,
  microF1: 0.549,
  mAP: 0.241,
  auc: 0.787,
}

export const trainingHistory = [
  { epoch: 1, loss: 0.42, valLoss: 0.38 },
  { epoch: 3, loss: 0.32, valLoss: 0.30 },
  { epoch: 5, loss: 0.26, valLoss: 0.25 },
  { epoch: 7, loss: 0.22, valLoss: 0.21 },
  { epoch: 10, loss: 0.18, valLoss: 0.18 },
]

export const aucByClass = [
  { class: 'Normal', auc: 0.85 },
  { class: 'Cardiomegaly', auc: 0.78 },
  { class: 'Effusion', auc: 0.76 },
  { class: 'Nodule', auc: 0.72 },
  { class: 'COPD', auc: 0.70 },
  { class: 'Pneumothorax', auc: 0.68 },
]

export const f1Scores = [
  { class: 'Normal', f1: 0.42 },
  { class: 'Cardiomegaly', f1: 0.18 },
  { class: 'Effusion', f1: 0.15 },
  { class: 'Nodule', f1: 0.12 },
]

/**
 * Figures exportées UNIQUEMENT depuis densenet121-seuiltbadel.ipynb
 * (frontend/public/analytics/densenet/)
 */
export const densenetNotebookFigures = [
  { src: '/analytics/densenet/dn_01_cell9.png', title: 'Distribution des 14 pathologies', caption: 'Fréquence des labels cibles — PadChest224' },
  { src: '/analytics/densenet/dn_08_cell26.png', title: 'Déséquilibre des classes', caption: 'Fréquence & ratio d\'imbalance' },
  { src: '/analytics/densenet/dn_10_cell35.png', title: 'Répartition Train / Val / Test', caption: 'Stratification par split' },
  { src: '/analytics/densenet/dn_11_cell45.png', title: 'Poids positifs (Focal Loss)', caption: 'Class weights par pathologie' },
  { src: '/analytics/densenet/dn_12_cell52.png', title: 'F1 : seuil 0.5 vs seuils optimaux', caption: 'Optimisation par classe (seuiltbadel)' },
  { src: '/analytics/densenet/dn_13_cell54.png', title: 'Courbes d\'entraînement DenseNet121', caption: 'Loss, AUC, F1 — 10 epochs (best checkpoint)' },
  { src: '/analytics/densenet/dn_14_cell56.png', title: 'AUC par pathologie (test)', caption: 'DenseNet121 — jeu de test' },
  { src: '/analytics/densenet/dn_15_cell58.png', title: 'Courbes ROC par classe', caption: '14 pathologies — test set' },
  { src: '/analytics/densenet/dn_04_cell15.png', title: 'Matrice de co-occurrence', caption: 'Co-occurrence des labels' },
  { src: '/analytics/densenet/dn_05_cell17.png', title: 'Exemples radiographiques', caption: 'Échantillons par pathologie' },
  { src: '/analytics/densenet/dn_16_cell60.png', title: 'Matrices de confusion (seuils optimaux)', caption: 'Test set — 14 pathologies DenseNet121' },
]

/** Grad-CAM DenseNet121 — notebook apresentraain (référence XAI, pas confusion matrix) */
export const GRADCAM_REFERENCE = '/gradcam/densenet121_gradcam.png'
export const GRADCAM_REFERENCE_ALT = '/analytics/gradcam_reference_full.png'
