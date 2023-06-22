import { useState, useEffect } from "react";
import "./playerRole.css"
import ButtonLink from "../../components/ButtonLink"
import { database } from "../../firebaseConnection";
import useSound from "use-sound";
import ambienceSound from "../../assets/ambience-soundeffect.mp3"
import { useNavigate } from "react-router-dom";
import { setDoc, doc, addDoc, collection, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import Popup from 'reactjs-popup';


const PlayerRole = () => {
    const [isRandomizerOpen, setIsRandomizerOpen] = useState(false);
    const [townRole, setTownRole] = useState([]);
    const [covenRole, setCovenRole] = useState([]);
    const [horsemenRole, setHorsemenRole] = useState([]);
    const [mafiaRole, setMafiaRole] = useState([]);
    const [user, setUser] = useState({});
    const [allRoles, setAllRoles] = useState([]);
    const [playerList, setPlayerList] = useState([]);
    const [neutralRole, setNeutralRole] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [enemyfill, setEnemyFill] = useState('');
    // information for setting the current information for a player
    const [currentFilliation, setCurrentFilliation] = useState('town');
    const [currentPlayer, setCurrentPlayer] = useState('');
    const [currentRole, setCurrentRole] = useState('');
    const navigate = useNavigate();
    const [playAmbienceSound, { stop }] = useSound(ambienceSound);
    useEffect(() => {
        async function loadInfo() {
            const userDetail = localStorage.getItem("UserLogin");
            setUser(JSON.parse(userDetail));
                const data = JSON.parse(userDetail);
                const unsub = onSnapshot(collection(database, `playeradmin/players/${data.email}`), (snapshot) => {
                    let list = [];
                    snapshot.forEach((doc) => {
                        list.push({
                            id: doc.id,
                            key: doc.id,
                            playerName: doc.data().playerName,
                            victoryPoints: doc.data().victoryPoints,
                            role: doc.data().role,
                            filliation: doc.data().filliation,
                        })
                    })
                    setPlayerList(list);
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
            const horsemenSnapshot = onSnapshot(collection(database, "gamedata/roles/horsemen"), (snapshot) => {
                let roles = [];
                snapshot.forEach((doc) => {
                    roles.push({
                        filliation: "horsemen",
                        role: doc.data().role,
                        skill: doc.data().skill,
                        special: doc.data().special,
                        wakeOrder: doc.data().wakeOrder

                    })
                })
                setHorsemenRole(roles);
                
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
        }
        loadInfo();
    }, []) 
    useEffect(() => {

        function addAllRoles(townRole, mafiaRole, covenRole, horsemenRole, neutralRole) {  
            setAllRoles([...townRole,...mafiaRole, ...covenRole, ...horsemenRole, ...neutralRole])
           
       }
        addAllRoles(covenRole, mafiaRole, townRole, horsemenRole, neutralRole);
    playAmbienceSound();

    }, [covenRole])
    const handleConfirm = async (e) => {
        e.preventDefault(); 
        const chosenPlayer = playerList.filter(player => player.playerName === currentPlayer);
        const chosenRole = allRoles.filter(role => role.role === currentRole);
        const chosenPlayerId = chosenPlayer[0].id
        const chosenRoleWakeOrder = chosenRole[0].wakeOrder
        await updateDoc(doc(database, "playeradmin", "players", user.email, chosenPlayerId), { role: currentRole, filliation: currentFilliation, life: "alive", action: "pending", wakeOrder: chosenRoleWakeOrder})

    }

    const handleReset = async (e) => {
        for (let i = 0; i < playerList.length; i++) {
            const currentId = playerList[i].id;
            await updateDoc(doc(database, "playeradmin", "players", user.email, currentId), {role: "none", filliation: "none", life: "none", action: "none", wakeOrder: 0})
        }
    }
    function mafiaFill() {
        document.querySelector('.coven').classList.add('invisible');
        document.querySelector('.cavaleirosDoApocalipse').classList.add('invisible');
        document.querySelector('.mafia').classList.remove('invisible');
    }
    function covenFill() {
        document.querySelector('.mafia').classList.add('invisible');
        document.querySelector('.cavaleirosDoApocalipse').classList.add('invisible');
        document.querySelector('.coven').classList.remove('invisible');

    }

    const startGame = () => {
        stop();
        navigate('/day');
    }
    async function handleRandomizer(enemy1, enemy2){
        const players = playerList.slice();
        var fill = []
        if (enemy2 === 'none') {
            fill = ['town', enemy1];
            
        } else {
            fill = ['town', enemy1, enemy2];
            
        }
        const roleD = allRoles.slice();
        console.log(fill)
        var randomizedPlayers = []
        for (var i = 0; players.length > 0; i++) {
            console.log(players.length);


            var selectedFillIndex = Math.floor(Math.random() * fill.length);
            var selectedFill = fill[selectedFillIndex]
            var filteredRoles = roleD.filter(role => role.filliation === selectedFill);
            if (filteredRoles.length === 0) {
                const fact = fill.splice(selectedFillIndex, 1)[0]
            } else {
                var selectedIndex = Math.floor(Math.random() * players.length);

                var selectedName = players.splice(selectedIndex, 1)[0];    
            var roleIndex = Math.floor(Math.random() * filteredRoles.length)
            var selectedRole = filteredRoles[roleIndex];
            console.log(selectedRole);
            var usedRole = roleD.filter(role => role.role === selectedRole.role)
            var roleToFind = usedRole[0]
            var index = roleD.findIndex(function (obj) {
                return obj.role === roleToFind.role;
            })
            const deletedRole = roleD.splice(index, 1)[0];
            console.log(roleD);
            randomizedPlayers.push({ selectedName, selectedRole })
            console.log(randomizedPlayers)
        }
            
        }
        console.log(randomizedPlayers)
        for (let i = 0; i < randomizedPlayers.length; i++) {
            const currentId = randomizedPlayers[i].selectedName.id;
            const currentRole = randomizedPlayers[i].selectedRole.role;
            const wakeOrder = randomizedPlayers[i].selectedRole.wakeOrder;
            console.log(randomizedPlayers[i])
            const currentFilliation = randomizedPlayers[i].selectedRole.filliation
                await updateDoc(doc(database, "playeradmin", "players", user.email, currentId), { role: currentRole, filliation: currentFilliation, life: "alive", action: "pending", wakeOrder: wakeOrder})
        }
    }
    return (
        <div className="playerRole">
            <h3 className="page-title">
            Seleciona a função de cada jogador
            </h3>
            <Popup open={isRandomizerOpen} modal closeOnDocumentClick={false}>
                <div className="modalNight">
                    <div className="header">Randomizador de Funções</div>
                    <div className="content modalRandomizerContent">
                        <span className="bordered">Jogar contra a Mafia
                            <button className="button" onClick={() => handleRandomizer('mafia', 'neutral')}>VS Mafia</button>
                        </span>
                        <span className="bordered">Jogar contra o Coven
                            <button className="button" onClick={() => handleRandomizer('coven', 'neutral')}>VS Coven</button>
                        </span>
                        <span className="bordered">Jogar contra os Cavaleiros

                            <button className="button" onClick={() => handleRandomizer('horsemen', 'none')}>VS Cavaleiros</button>
                        <span className="smallText">Limite de 21 jogadores!</span>
                        </span>
                            <button className="button" onClick={() => setIsRandomizerOpen(false)}>Fechar Randomizador</button>
                        </div>
                    </div>
            </Popup>
            <div className="playerRole-main">
                <div className="playerRole-assign">
                    <form >
                        <label >
                            Jogador:
                            <select name="player" id="player" value={currentPlayer} onChange={(e) => setCurrentPlayer(e.target.value)}>
                                {playerList.map((player) => (
                                    <option key={player.key}>{player.playerName}
                                    </option>
                                ))}

                            </select>
                        </label>
                        <label >
                            Filiação:
                            <select name="affiliation" id="affiliation" value={currentFilliation} onChange={(e) => setCurrentFilliation(e.target.value)} >
                                    <option value="town" id="town">Cidade</option>
                                    <option value="coven" id="coven" className="coven">Coven</option>
                                    <option value="mafia" className="mafia">Mafia</option>
                                    <option value="horsemen" className="cavaleirosDoApocalipse">Cavaleiros do Apocalipse</option>
                                    <option value="neutral" className="neutral">Neutros</option>
                            </select>
                        </label>
                        <label >
                            Função:
                            <select name="role" id="role" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)}>
                                {allRoles.filter(role => role.filliation.includes(currentFilliation)).map(filteredrole => (
                                    <option key={filteredrole.role}>{filteredrole.role}</option>
                                ))} ;
                                

                            </select>
                        </label>
                        <button type="submit" className="button" onClick={handleConfirm}>Confirmar</button>
                        <button type="button" className="button" onClick={handleReset}>Resetar Todos</button>
                        <button type="button" className="button" onClick={() => setIsRandomizerOpen(true)}>Randomizar</button>
                    </form>
                    <div className="selecting-opponent">
                        <button type="button" onClick={mafiaFill} className="button">Mafia</button>
                        <button type="button" onClick={covenFill} className="button">Coven</button>
                        {/* <button type="button" onClick={setEnemyFilliation("cavaleirosDoApocalipse")} className="button">Mafia</button> */}
                    </div>
                </div>
                <div className="playerRole-roles">
                    <div className="town">
                        <h4>
                        Cidade
                        </h4>
                        <div className="playerRole-town card-border scrollable">
                            {playerList.filter(player => player.filliation.includes("town")).map(filteredPlayer => (
                            <p key={filteredPlayer.id}>{filteredPlayer.playerName} - {filteredPlayer.role}</p>
                                ))}
                        </div>
                    </div>
                    <div className="evil">
                        <h4>
                        Mafia/Coven/Cavaleiros
                        </h4>
                        <div className="playerRole-evil card-border scrollable">
                        {playerList.filter(player => player.filliation.includes("mafia")).map(filteredPlayer => (
                            <p key={filteredPlayer.id}>{filteredPlayer.playerName} - {filteredPlayer.role}</p>
                                ))}
                        {playerList.filter(player => player.filliation.includes("coven")).map(filteredPlayer => (
                            <p key={filteredPlayer.id}>{filteredPlayer.playerName} - {filteredPlayer.role}</p>
                                ))}
                        {playerList.filter(player => player.filliation.includes("horsemen")).map(filteredPlayer => (
                            <p key={filteredPlayer.id}>{filteredPlayer.playerName} - {filteredPlayer.role}</p>
                                ))}
                        </div>
                    </div>
                    <div className="neutral">
                        <h4>
                        Neutro
                        </h4>
                        <div className="playerRole-neutral card-border scrollable">
                        {playerList.filter(player => player.filliation.includes("neutral")).map(filteredPlayer => (
                            <p key={filteredPlayer.id}>{filteredPlayer.playerName} - {filteredPlayer.role}</p>
                                ))}
                        </div>
                    </div>
                    <div className="button-container button-area">
                <ButtonLink destination="/playerlist" buttonText="Voltar"/>
                <button onClick={startGame} className="button">Começar Jogo</button>
            </div>
                </div>
            </div>

        </div>
        
    )
}

export default PlayerRole;