using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApp_OpenIDConnect_DotNet.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class ClientsController : Controller
    {
        private readonly ILogger _logger;

        public ClientsController(ILogger<ClientsController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public dynamic Index()
        {
            var clients = new List<dynamic>
            {
                new
                {
                    Name = "Tim Perez"
                },
                new
                {
                    Name = "John Smith"
                }
            };

            return clients;
        }

        [HttpPost]
        public object PostData(object data)
        {
            _logger.LogInformation("Post data received!");

            return new
            {
                message = "data was successfully posted!"
            };
        }
    }
}
