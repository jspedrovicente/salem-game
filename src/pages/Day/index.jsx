import "./day.css"
import ButtonLink from "../../components/ButtonLink"
import { setDoc, doc, addDoc, collection, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../../firebaseConnection";
import { useNavigate } from "react-router-dom";
import useSound from "use-sound";
import julgamentoSound from "../../assets/julgamento-soundeffect.mp3"
import morteSound from "../../assets/morte-soundeffect.mp3"
import bombFizzle from "../../assets/bomb fizzle effect.mp3"
import bombBoom from "../../assets/bomb effect.mp3"
import gunSound from "../../assets/gun shot effect.mp3"


const Day = () => {

// sound effects
const [playJulgamentoSound] = useSound(julgamentoSound);
const [playFizzleSound] = useSound(bombFizzle);
const [playBombSound] = useSound(bombBoom);
const [playmorteSound] = useSound(morteSound);
const [playGunSound] = useSound(gunSound);
    
const [user, setUser] = useState([]);
const [players, setPlayers] = useState([]);
const [alivePlayers, setAlivePlayers] = useState([]);
const [deadPlayers, setDeadPlayers] = useState([]);
const [townRole, setTownRole] = useState([]);
const [covenRole, setCovenRole] = useState([]);
const [mafiaRole, setMafiaRole] = useState([]);
const [neutralRole, setNeutralRole] = useState([]);
const [allRoles, setAllRoles] = useState([]);
const [currentDayTemp, setCurrentDayTemp] = useState([]);
const [currentDay, setCurrentDay] = useState(0);
const [announcements, setAnnouncements] = useState([]);
const [allPublicEvents, setAllPublicEvents] = useState([]);
const navigateToNight = useNavigate();
const [playerKilling, setPlayerKilling] = useState('');
    
    


// Night actions that transfers to morning
const [visitAction, setVisitAction] = useState([]);
const [executorAction, setExecutorAction] = useState([]);
const [poisonAction, setPoisonAction] = useState([]);
const [armadilheiroInformation, setArmadilheiroInformation] = useState([]);
const [spyInformation, setSpyInformation] = useState([]);
const [padeiraHealCount, setPadeiraHealCount] = useState(0)
const [arsonTarget, setArsonTarget] = useState([]);
const [statusAfliction, setStatusAfliction] = useState([]);   
const [parasiteTarget, setParasiteTarget] = useState([]);
    
    useEffect(() => {
        const loadUserInformation = () => {
            const userDetail = localStorage.getItem("UserLogin");
            setUser(JSON.parse(userDetail));
            const data = JSON.parse(userDetail);
        }
    
        
        loadUserInformation();
    }, [])
    useEffect(() => {
        const loadPlayers = () => {
            const x = onSnapshot(collection(database, `playeradmin/players/${user.email}`), (snapshot) => {
                let list = [];
                snapshot.forEach((doc) => {
                    list.push({
                        id: doc.id,
                        key: doc.id,
                        playerName: doc.data().playerName,
                        victoryPoints: doc.data().victoryPoints,
                        role: doc.data().role,
                        filliation: doc.data().filliation,
                        life: doc.data().life,
                        action: doc.data().action,
                        wakeOrder: doc.data().wakeOrder
                    })
                })
                setPlayers(list);
                setAlivePlayers(list.sort((a, b) => a.wakeOrder - b.wakeOrder).filter(player => player.life.includes("alive")))
                setDeadPlayers(list.sort((a, b) => a.wakeOrder - b.wakeOrder).filter(player => player.life.includes("dead")))
            })
            const townSnapshot = onSnapshot(collection(database, "gamedata/roles/town"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filliation: "town",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special,
                        wakeOrder: doc.data().wakeOrder
                    })
                })
                setTownRole(roles)
    
            })
            const mafiaSnapshot = onSnapshot(collection(database, "gamedata/roles/mafia"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filliation: "mafia",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special,
                        wakeOrder: doc.data().wakeOrder
    
                    })
                })
                setMafiaRole(roles);
            })
            const covenSnapshot = onSnapshot(collection(database, "gamedata/roles/coven"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filliation: "coven",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special,
                        wakeOrder: doc.data().wakeOrder
    
                    })
                })
                setCovenRole(roles);
                
            })
            const neutralSnapshot = onSnapshot(collection(database, "gamedata/roles/neutral"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filliation: "neutral",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special,
                        wakeOrder: doc.data().wakeOrder
    
                    })
                })
                setNeutralRole(roles);
                
            })
            const dayCounterSnapshot = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/dayCounter/dayCounter`), (snapshot) => {
                const currentDayx = [];
                snapshot.forEach((doc) => {

                    currentDayx.push({ currentDay: doc.data().currentDay })

                })
                
                setCurrentDay(currentDayx[0].currentDay)
                setCurrentDayTemp(currentDayx)
            })
        }
    
        loadPlayers();
    }, [user.email]);
    useEffect(() => {
    
        function addAllRoles(townRole, mafiaRole, covenRole, neutralRole) {
            setAllRoles([...townRole, ...mafiaRole, ...covenRole, ...neutralRole])
           
        }
        addAllRoles(covenRole, mafiaRole, townRole, neutralRole);
    }, [covenRole])

    useEffect(() => {
        const importData = () => {
            const aflictionData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({ target: doc.data().target, status: doc.data().status, key: doc.id, id: doc.id });
                })
                setStatusAfliction(temp)
            })
            const executorData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/executorTarget/executorTarget`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({ target: doc.data().target, key: doc.id, id: doc.id });
                })
                setExecutorAction(temp)
            })
            const arsonData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/arsonTarget/arsonTarget`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({ target: doc.data().playerName, key: doc.id, id: doc.id });
                })
                setArsonTarget(temp)
            })
            const armadilheiroData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/armadilheiroInformation/armadilheiroInformation`), (snapshot) => {
                let he = [];
                snapshot.forEach((doc) => {
                    he.push({ role: doc.data().role, key: doc.id, id: doc.id });
                })
                setArmadilheiroInformation(he)
            })
            const spyData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/spyInformation/spyInformation`), (snapshot) => {
                let her = [];
                snapshot.forEach((doc) => {
                    her.push({ visited: doc.data().visited, key: doc.id, id: doc.id });
                })
                setSpyInformation(her)
            })
            const poisonData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/poisonTarget/poisonTarget`), (snapshot) => {
                let her = [];
                snapshot.forEach((doc) => {
                    her.push({ target: doc.data().visited, key: doc.id, id: doc.id });
                })
                setPoisonAction(her)
            })
            const parasiteData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/parasiteTarget/parasiteTarget`), (snapshot) => {
                let her = [];
                snapshot.forEach((doc) => {
                    her.push({ target: doc.data().playername, key: doc.id, id: doc.id });
                })
                setParasiteTarget(her)
            })
            const visitData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/visitAction/visitAction`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({
                        visitor: doc.data().visitor,
                        target: doc.data().target,
                        id: doc.id,
                        key: doc.id
                    })
                })
                setVisitAction(temp);
            })
            const annoucedData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/announcements/announcements`), (snapshot) => {
                let lol = [];
                snapshot.forEach((doc) => {
                    lol.push({
                        killedPlayer: doc.data().killedPlayer,
                        killedPlayerRole: doc.data().killedPlayerRole,
                        attackerRole: doc.data().attackerRole,
                        key: doc.id,
                        id: doc.id
                    })
                })
                setAnnouncements(lol);
            })
            const publicEvents = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/publicEvents/publicEvents`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({
                        target: doc.data().target,
                        event: doc.data().event,
                        id: doc.id,
                        key: doc.id
                    })
                })
                setAllPublicEvents(temp);
            })
        }
        importData();
    }, [user.email])
    const endGameCompletely = async () => {
        for (let p = 0; p < statusAfliction.length; p++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, statusAfliction[p].id)
            await deleteDoc(theRef)

        }
        for (let i = 0; i < allPublicEvents.length; i++){
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/publicEvents/publicEvents`, allPublicEvents[i].id)
            await deleteDoc(theRef)

        }
        for (let i = 0; i < announcements.length; i++){
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/announcements/announcements`, announcements[i].id)
            await deleteDoc(theRef)

        }
        for (let i = 0; i < announcements.length; i++){
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/announcements/announcements`, announcements[i].id)
            await deleteDoc(theRef)

        }
        for (let i = 0; i < deadPlayers.length; i++){
            await updateDoc(doc(database, "playeradmin", "players", user.email , deadPlayers[i].id), {life: "none", filliation: "none", role: "none"})

        }
        for (let i = 0; i < executorAction.length; i++){
            await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email , "executorTarget", "executorTarget" , "executorTarget"), {target: ''})

        }
        for (let i = 0; i < arsonTarget.length; i++){
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/arsonTarget/arsonTarget`, arsonTarget[i].id)
            await deleteDoc(theRef)

        }
        for (let i = 0; i < poisonAction.length; i++){
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/poisonTarget/poisonTarget`, poisonAction[i].id)
            await deleteDoc(theRef)

        }
        for (let i = 0; i < parasiteTarget.length; i++){
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/parasiteTarget/parasiteTarget`, parasiteTarget[i].id)
            await deleteDoc(theRef)

        }
        for (let i = 0; i < armadilheiroInformation.length; i++){
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/armadilheiroInformation/armadilheiroInformation`, armadilheiroInformation[i].id)
            await deleteDoc(theRef)

        }
        for (let i = 0; i < spyInformation.length; i++){
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/spyInformation/spyInformation`, spyInformation[i].id)
            await deleteDoc(theRef)

        }
        clearNeedlessData();
        await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "dayCounter", "dayCounter", "dayCounter"), { currentDay: 1 })
        await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "padeiraHeals", "padeiraHeals", "padeiraHeals"), { healCountMax: 4 });
        await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "weaponChoice", "weaponChoice", "weaponChoice"), { weapon: "none" });

        
        navigateToNight('/playerlist')
    }
    const clearNeedlessData = () => {
        // clears visitAction
        for (let p = 0; p < visitAction.length; p++){
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/visitAction/visitAction`, visitAction[p].id)
            deleteDoc(theRef);
        }
        // clears bomb, marks, motivations and parasites.
        const bombClear = statusAfliction.filter(status => { return status.status === 'bomba' })
        const markClear = statusAfliction.filter(status => {return status.status === 'marcado'})
        const motivateClear = statusAfliction.filter(status => { return status.status === 'motivado' })
        const parasiteClear = statusAfliction.filter(status => { return status.status === 'parasita' })
        const chantagemClear = statusAfliction.filter(status => { return status.status === 'chantageado' })
        for (let p = 0; p < bombClear.length; p++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, bombClear[p].id)
            deleteDoc(theRef)
        }
        for (let p = 0; p < chantagemClear.length; p++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, chantagemClear[p].id)
            deleteDoc(theRef)
        }
        for (let p = 0; p < markClear.length; p++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, markClear[p].id)
            deleteDoc(theRef)
        }
        for (let p = 0; p < motivateClear.length; p++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, motivateClear[p].id)
            deleteDoc(theRef)
        }
        for (let i = 0; i < announcements.length; i++){
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/announcements/announcements`, announcements[i].id)
            deleteDoc(theRef);
        }
        for (let i = 0; i < allPublicEvents.length; i++){
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/publicEvents/publicEvents`, allPublicEvents[i].id)
            deleteDoc(theRef)

        }
        for (let i = 0; i < armadilheiroInformation.length; i++){
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/armadilheiroInformation/armadilheiroInformation`, armadilheiroInformation[i].id)
            deleteDoc(theRef)

        }
        for (let i = 0; i < spyInformation.length; i++){
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/spyInformation/spyInformation`, spyInformation[i].id)
            deleteDoc(theRef)

        }
        if (currentDay > 4) {
            for (let p = 0; p < parasiteClear.length; p++) {
                const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, parasiteClear[p].id)
                deleteDoc(theRef)
            }
        }
    }
    const explodeBomb = () => {
        for (let i = 0; i < statusAfliction.length; i++) {

            if (statusAfliction[i].status === 'bomba') {
                let num = Math.random();
                const targetted = alivePlayers.filter(target => { return target.playerName === statusAfliction[i].target })
                
                if (num < 0.6) {
                    playBombSound();
                    setTimeout(() => {
                        updateDoc(doc(database, "playeradmin", "players", user.email, targetted[0].id), { life: "dead" })
                    }, 7000);

                } else {
                    playFizzleSound();
                }
                const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, statusAfliction[i].id)
                deleteDoc(theRef)
                return;
            }
        }
    }
    const explodeMark = () => {
        for (let i = 0; i < statusAfliction.length; i++) {
            if (statusAfliction[i].status === 'marcado') {
                const targetted = alivePlayers.filter(target => { return target.playerName === statusAfliction[i].target })

                playGunSound();
                updateDoc(doc(database, "playeradmin", "players", user.email, targetted[0].id), { life: "dead"})
                const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/statusAfliction/statusAfliction`, statusAfliction[i].id)
                deleteDoc(theRef)
                return;
            }
        }
    }
    const startNight = () => {
        clearNeedlessData();
        navigateToNight('/night');
    }
    const killPlayer = () => {
        playmorteSound();
        const target = alivePlayers.filter(player => { return player.playerName === playerKilling });
        updateDoc(doc(database, "playeradmin", "players", user.email, target[0].id), { life: "dead" })

    }
    return (
        // The day has to set all the player actions as pending
        <div className="day">

            <h3 className="page-title">
                Dia {currentDay}
            </h3>

            <div className="dayMain">
                <div className="event-ocurrence event">
                        <h4>
                        Acontecimentos
                        </h4>
                    <div className="large-container card-border scrollable">
                        {announcements.map((announcement) => (
                            <p key={announcement.key}>
                                {announcement.killedPlayer} morreu. Quem o matou foi: {announcement.attackerRole}. Sua função era {announcement.killedPlayerRole}.
                            </p>
                        
                        ))}
                        {allPublicEvents.map((event) => (
                            <p key={event.key}>
                                {event.target} está/tem: {event.event}
                            </p>
                        ))}
                        {armadilheiroInformation.map((info) => (
                            <p key={info.key}>Armadilha ativada: {info.role} visitou seu alvo!</p>
                        ))}
                        {spyInformation.map((info) => (
                            <p key={info.key}>Espião: Seu Alvo visitou: {info.visited}!</p>
                        ))}
                        </div>
                </div>


                <div className="event-hiddenocurrence event">
                        <h4>
                        Ações da Noite
                        </h4>
                    <div className="card-border scrollable event-hiddenocurrence-inner">
                        {visitAction.map((visit) => (
                            <p key={visit.key}>
                                {visit.visitor} visitou {visit.target}
                        </p>
                    ))}    
                    </div>
                </div>
                <div className="event-status event">
                        <h4>
                        Status
                        </h4>
                    <div className="large-container card-border scrollable">
                    {statusAfliction.map((player) => (
                                        <p key={player.key + '4'}>
                            {player.target} - {player.status}
                                        </p>
                                    ))}
                        </div>
                </div>
                <div className="event-aliveplayers event">
                        <h4>
                        Jogadores Vivos
                        </h4>
                    <div className="large-container card-border scrollable">
                    {alivePlayers.map((player) => (
                                        <p key={player.key + '2'}>
                            {player.playerName} - {player.role}
                                        </p>
                                    ))}
                        </div>
                </div>
                <div className="event-death event">
                        <h4>
                        Jogadores Mortos
                        </h4>
                    <div className="large-container card-border scrollable">
                        {deadPlayers.map((player) => (
                            <p key={player.key + '3'}>
                            {player.playerName} - {player.role}
                                        </p>
                                    ))}
                    </div>
                </div>



                <div className="event-killplayer event">
                    <div className="event-killplayer-inner">
                        <h4>Nome:</h4>
                        <select name="playerName" id="playerName" value={playerKilling} onChange={(e) => setPlayerKilling(e.target.value)}>
                            <option value="" defaultValue disabled hidden></option>
                            {alivePlayers.map(player => (
                                <option key={player.key}>{player.playerName}</option>
                            ))}
                        </select>
                        <button className="button" onClick={killPlayer}>Matar Jogador</button>
                        <button type="button" onClick={playJulgamentoSound} className="button">Iniciar Julgamento</button>
                        <button type="button" onClick={startNight} className="button">Começar Noite</button>
                        <button className="button" onClick={endGameCompletely}>Encerrar Jogo</button>
                        <button className="button" onClick={explodeBomb}>Bomba do Palhaço</button>
                        <button className="button" onClick={explodeMark}>Atirar na Marca</button>

                    </div>

                </div>
                                
            </div>
            <div className="upper-page-area">
            </div>
        </div>
    )
}

export default Day;