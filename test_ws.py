import sys
import string
from   ws import indexText

fd = open("/Users/mulligen/ws_log.txt","w")
response = indexText("Characterization of the 3-HKT gene in important malaria vectors in India, viz: Anopheles culicifacies and Anopheles stephensi (Diptera: Culicidae).  The 3-hydroxykynurenine transaminase (3-HKT) gene plays a vital role in the development of malaria parasites by participating in the synthesis of xanthurenic acid, which is involved in the exflagellation of microgametocytes in the midgut of malaria vector species. The 3-HKT enzyme is involved in the tryptophan metabolism of Anophelines. The gene had been studied in the important global malaria vector, Anopheles gambiae. In this report, we have conducted a preliminary investigation to characterize this gene in the two important vector species of malaria in India, Anopheles culicifacies and Anopheles stephensi. The analysis of the genetic structure of this gene in these species revealed high homology with the An. gambiae gene. However, four non-synonymous mutations in An. stephensi and seven in An. culicifacies sequences were noted in the exons 1 and 2 of the gene; the implication of these mutations on enzyme structure remains to be explored..",fd)
print response
fd.close()